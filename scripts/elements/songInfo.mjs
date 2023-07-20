import {
  hooksOff,
  hooksOn,
  renderTemplateWrapper,
  updateWrapper,
} from "../foundryWrapper.mjs";
import { CUSTOM_HOOKS } from "../observables.mjs";
import { TEMPLATE_IDS, getTemplatePath } from "../templates.mjs";
import { cycleClass, cycleIcon } from "../utils.mjs";

function registerHooks(volumeBar, songId) {
  // getSound
  hooksOn(CUSTOM_HOOKS.getSound, volumeBar, (update) => {
    // update from FoundryVTT-slider to PM-slider
    const soundId = update?.passthrough?.soundId;
    if (!soundId || soundId !== songId) return;

    const ignoreUpdate = update.prop !== "play";
    if (ignoreUpdate) return;

    const foundryInputVolume = $($.find("#currently-playing"))
      ?.find('*[data-sound-id="S32cs3O21XeLGtDQ"]')
      ?.find("input")
      ?.val();
    if (!foundryInputVolume && foundryInputVolume !== 0) return;

    const volumeBarVolume = $(volumeBar)?.val();
    if (foundryInputVolume === volumeBarVolume) return;

    $(volumeBar).val(foundryInputVolume);
  });
}

export async function addSongInfo(element, song) {
  if (!element?.length) return;
  const id = song.id;

  // create template
  const template = await renderTemplateWrapper(
    getTemplatePath(TEMPLATE_IDS.SONG_INFO),
    { id, name: song.name, currentVolume: song.volume }
  );
  element.append(template);

  // event handling
  const songInfo = element.find(`#${id}-song-info`);
  if (!songInfo?.length) return;

  // volume-bar
  const volumeBar = songInfo.find(".pm-volume-bar");
  volumeBar.on("change", (event) => {
    const element = $(event.target);
    const value = element?.val();
    if (!value && value !== 0) return;
    updateVolume(song, value);
    // todo change icon
    // idea => save previous value as data-attribute
  });

  // volume button
  const volume = songInfo.find('*[data-icon="volume"]');
  volume?.on("click", () => {
    const val = $(volumeBar)?.val();
    const newVolume = val === "0" ? 1.0 : 0.0;

    $(volumeBar)?.val(newVolume);
    updateVolume(song, newVolume);
    cycleIcon(volume);
  });

  // repeat button
  const repeat = songInfo.find('*[data-icon="repeat"]');
  repeat?.on("click", async () => {
    cycleClass(repeat, "pm-enabled");
    // update Song value
    await updateWrapper(song, { repeat: !song.repeat });
    // update FoundryVTT repeat icon
    const soundControls = $(`*[data-sound-id="${id}"]`)?.find(".sound-control");
    if (!soundControls?.length) return;
    song.repeat
      ? soundControls.removeClass("inactive")
      : soundControls.addClass("inactive");
  });

  // register custom Hooks (emitted by observable)
  registerHooks(volumeBar, id);

  // set correct repeat-icon on load
  if (song.repeat) {
    cycleClass(repeat, "pm-enabled");
  }

  // set correct volume-icon on load
  if (volumeBar.val() === "0") {
    cycleIcon(volume);
  }
}

export function removeSongInfoHooks(element, id) {
  const volumeBar = element.find(`#${id}-song-info`)?.find(".pm-volume-bar");
  hooksOff(CUSTOM_HOOKS.getSound, volumeBar);
}

/**
 * Hack for FoundryVTT volume update of slider and sound.
 * Necessary because sound.debounceVolume() function doesn't update UI.
 * @param {Sound} sound Sound-obj of FoundryVTT
 * @param {number} volume volume between 0.0 and 1.0.
 */
function updateVolume(sound, volume) {
  const soundId = sound.id;
  $($.find("#currently-playing"))
    ?.find(`*[data-sound-id="${soundId}"]`)
    ?.find("input")
    ?.val(volume);
  sound.debounceVolume(volume);
}
