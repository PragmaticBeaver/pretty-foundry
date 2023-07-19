import {
  hooksOff,
  hooksOn,
  renderTemplateWrapper,
} from "../foundryWrapper.mjs";
import { CUSTOM_HOOKS } from "../observables.mjs";
import { TEMPLATE_IDS, getTemplatePath } from "../templates.mjs";

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

  // volume
  const volumeBar = element.find(`#${id}-song-info`)?.find(".pm-volume-bar");
  volumeBar.on("change", (event) => {
    const element = $(event.target);
    const value = element?.val();
    if (!value && value !== 0) return;

    // hack: set volume of FoundryVTT input element because volume-slider doesn't react to .debounceVolume()
    $($.find("#currently-playing"))
      ?.find(`*[data-sound-id="${id}"]`)
      ?.find("input")
      ?.val(value);
    song.debounceVolume(value);
  });

  // todo buttons

  // register custom Hooks (emitted by observable)
  registerHooks(volumeBar, id);
}

export function removeSongInfoHooks(element, id) {
  const volumeBar = element.find(`#${id}-song-info`)?.find(".pm-volume-bar");
  hooksOff(CUSTOM_HOOKS.getSound, volumeBar);
}
