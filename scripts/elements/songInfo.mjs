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
    const soundId = update?.passthrough?.soundId;
    if (!soundId || soundId !== songId) return;

    const ignoreUpdate = update.prop !== "play";
    if (ignoreUpdate) return;

    const volume = update?.target?.volume;
    if (!volume && volume !== 0) return;

    $(volumeBar).val(volume * 100);
  });
}

export async function addSongInfo(element, song) {
  if (!element?.length) return;
  const id = song.id;

  // create template
  const template = await renderTemplateWrapper(
    getTemplatePath(TEMPLATE_IDS.SONG_INFO),
    { id, name: song.name, currentVolume: song.volume * 100 }
  );
  element.append(template);

  // register custom Hooks (emitted by observable)
  const volumeBar = element.find(`#${id}-song-info`)?.find(".pm-volume-bar");
  registerHooks(volumeBar, id);
}

export function removeSongInfoHooks(element, id) {
  const volumeBar = element.find(`#${id}-song-info`)?.find(".pm-volume-bar");
  hooksOff(CUSTOM_HOOKS.getSound, volumeBar);
}
