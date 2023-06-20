import { renderTemplateWrapper } from "./foundryWrapper.mjs";
import { logToConsole } from "./log.mjs";
import { updateProgressBar } from "./sound.mjs";
import { TEMPLATE_IDS, getTemplatePath } from "./templates.mjs";
import { makeObservable } from "./utils.mjs";

function registerHooks(nodeElement, songId) {
  const state = nodeElement.data();

  // getSound
  const getHookId = Hooks.on(`getSound-${songId}`, (update) => {
    const songProgress = nodeElement.find(".song-node-progress-bar");
    updateProgressBar(songProgress, update);

    // todo update SongName
    // logToConsole({ update });

    const songNameElement = nodeElement.find(".song-node-name");
    songNameElement.html();
  });
  state["getHookId"] = getHookId;

  // setSound
  // const setHookId = Hooks.on(`setSound-${songId}`, (update) =>
  //   logToConsole(update)
  // );
  // state["setHookId"] = setHookId;
}

/**
 * Adds SongNode as child to element.
 * @param {jQuery} element to add new SongNode to
 * @param {*} song FoundryVTT Sound object
 * @param {string} playlistName name of Playlist
 * @returns {Promise<void>}
 */
export async function addSongNode(element, song, playlistName) {
  if (!element?.length) return;
  const songId = song.id;

  // create template
  const soundNodeTemplate = await renderTemplateWrapper(
    getTemplatePath(TEMPLATE_IDS.SONG_NODE),
    { id: songId, playlistName, songName: song.name } // todo playlistName
  );
  element.append(soundNodeTemplate);

  // register custom Hooks (emitted by observable)
  const songNodeElement = element.find(`#song-node-${songId}`);
  registerHooks(songNodeElement, songId);

  // add "click"-handler
  if (songNodeElement?.length) {
    songNodeElement.on("click", async () => {
      logToConsole("click on", songId);
    });
  }

  // replace sound-obj with Proxy
  song.sound = makeObservable(
    song.sound,
    `getSound-${songId}`,
    `setSound-${songId}`,
    false
  );
}

/**
 * Removes rendered SongNode from element.
 * @param {jQuery} element parent of SongNode to remove
 * @param {string} soundId ID of Sound-obj of rendered SongNode to remove
 * @returns {void}
 */
export function removeSongNode(element, songId) {
  if (!element?.length) return;

  const node = element.find(`#song-node-${songId}`);
  if (!node?.length) return;

  const { getHookId } = node.data();
  Hooks.off(`getSound-${songId}`, getHookId);
  // Hooks.off(`setSound-${songId}`, setHookId);
  node.remove();
}

export function updateSongNode(element, songId) {
  // todo
}
