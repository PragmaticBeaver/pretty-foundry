import { renderTemplateWrapper } from "../foundryWrapper.mjs";
import { TEMPLATE_IDS, getTemplatePath } from "../templates.mjs";

// function registerHooks(progressElement, soundId) {
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
// }

export async function addSongInfo(element, song) {
  if (!element?.length) return;
  const id = song.id;

  // create template
  const template = await renderTemplateWrapper(
    getTemplatePath(TEMPLATE_IDS.SONG_INFO),
    { id, name: song.name, currentlyPlayingSongDuration: undefined }
  );
  element.append(template);

  // register custom Hooks (emitted by observable)
  // todo find bar-element
  // registerHooks(progressElement, id);
}

// export function removeSongInfo(element, id) {
//   // todo
// }
