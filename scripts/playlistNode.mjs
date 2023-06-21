import { renderTemplateWrapper } from "./foundryWrapper.mjs";
import { TEMPLATE_IDS, getTemplatePath } from "./templates.mjs";

/**
 * Adds PlaylistNode (no SongNode included) as child to element.
 * @param {jQuery} element to add new PlaylistNode to
 * @param {*} playlist FoundryVTT Playlist object
 * @returns {Promise<void>}
 */
export async function addPlaylistNode(element, playlist) {
  if (!element?.length) return;
  const id = playlist.id;

  // create template
  const soundNodeTemplate = await renderTemplateWrapper(
    getTemplatePath(TEMPLATE_IDS.PLAYLIST_NODE),
    { id, playlistName: playlist.name }
  );
  element.append(soundNodeTemplate);
}

/**
 * Removes the PlaylistNode from the DOM. Should be called AFTER SongNode Hooks have been removed!
 * @param {jQuery} element parent of PlaylistNode to remove
 * @param {*} playlistIdID of Playlist-obj of rendered PlaylistNode to remove
 * @returns {void}
 */
export function removePlaylistNode(element, playlistId) {
  if (!element?.length) return;
  element.find(`#playlist-node-${playlistId}`)?.remove();
}
