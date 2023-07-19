import { renderTemplateWrapper } from "../foundryWrapper.mjs";
import { TEMPLATE_IDS, getTemplatePath } from "../templates.mjs";

function registerHooks(progressElement, soundId) {
  //   const state = progressElement.data();
  //   // getSound
  //   const getHookId = Hooks.on(`getSound-${soundId}`, (update) => {
  //     updateProgressBar(progressElement, update);
  //   });
  //   state["getHookId"] = getHookId;
  //   // setSound
  //   // const setHookId = Hooks.on(`setSound-${soundId}`, (update) =>
  //   //   logToConsole(update)
  //   // );
  //   // state["setHookId"] = setHookId;
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
  const volumeBar = element.find(`#${id}-song-info`)?.find("pm-volume-bar");
  registerHooks(volumeBar, id);
}

// export function removeSongInfo(element, id) {
//   // todo
// }
