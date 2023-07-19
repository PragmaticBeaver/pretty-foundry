import {
  hooksOff,
  hooksOn,
  renderTemplateWrapper,
} from "../foundryWrapper.mjs";
import { logToConsole } from "../log.mjs";
import { CUSTOM_HOOKS } from "../observables.mjs";
import { TEMPLATE_IDS, getTemplatePath } from "../templates.mjs";

function registerHooks(volumeBar, songId) {
  // getSound
  hooksOn(CUSTOM_HOOKS.getSound, volumeBar, (update) => {
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
    logToConsole({ foundryInputVolume, volumeBarVolume });
    if (foundryInputVolume === volumeBarVolume) return;

    // todo how to handle Updates from PM to FoundryVTT ?
    // todo what event re-renders the volume slider? is there even an event?
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

  // register custom Hooks (emitted by observable)
  const volumeBar = element.find(`#${id}-song-info`)?.find(".pm-volume-bar");
  volumeBar.on("change", (event) => {
    const element = $(event.target);
    const value = element?.val();
    if (!value && value !== 0) return;

    logToConsole("volume at the time of change-event", value);
    // todo
    song.debounceVolume(value);
  });
  registerHooks(volumeBar, id);
}

export function removeSongInfoHooks(element, id) {
  const volumeBar = element.find(`#${id}-song-info`)?.find(".pm-volume-bar");
  hooksOff(CUSTOM_HOOKS.getSound, volumeBar);
}
