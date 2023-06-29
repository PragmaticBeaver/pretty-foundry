/**
 * !!! DEV-INFO !!!
 * The following wrapper functions are mainly used for type support inside other files.
 */

/**
 * Wrapper of FoundryVTT CONFIG.debug.hooks property.
 * @param {boolean} enabled
 */
export function setHookDebugging(enabled = false) {
  CONFIG.debug.hooks = enabled;
}

/**
 * Wrapper of "FoundryVTT Namespace utils" mergeObject function
 * @param {Record<string,any>} original
 * @param {Record<string,any>} update
 * @param {{insertKeys: boolean, insertValues: boolean, overwrite: boolean, recursive: boolean, inplace: boolean, enforceTypes: boolean, performDeletions: boolean}} [config]
 */
export function mergeObjectWrapper(original, update, config) {
  return mergeObject(original, update, config);
}

/**
 * Wrapper of "FoundryVTT Module client" loadTemplates function
 * @param {Record<string, string>} templates
 * @returns {Promise<Function[]>}
 */
export async function loadTemplatesWrapper(templates) {
  return await loadTemplates(templates);
}

/**
 * Wrapper of "FoundryVTT Module client" renderTemplate function
 * @param {string} path HTML template path
 * @param {any} data data object for template compilation
 * @returns {Promise<string>}
 */
export async function renderTemplateWrapper(path, data) {
  return await renderTemplate(path, data);
}

/**
 * Wrapper of "FoundryVTT ClientSettings" get function
 * @param {string} moduleId
 * @param {string} settingId
 * @returns {any}
 */
export function getSettingsValue(moduleId, settingId) {
  return game?.settings?.get(moduleId, settingId);
}

/**
 * Wrapper of "FoundryVTT game.playlists.playing" property
 * @returns {Playlist[] | undefined}
 */
export function getPlayingPlaylists() {
  return game?.playlists?.playing;
}

/**
 * Wrapper of "FoundryVTT game.playlists" property
 * @returns {Playlist[] | undefined}
 */
export function getPlaylists() {
  return game?.playlists;
}

/**
 * Wrapper of "FoundryVTT game.playlists" get function
 * @param {*} id playlist ID
 * @returns {Playlist | undefined}
 */
export function getPlaylist(id) {
  return game?.playlists?.get(id);
}

export const FOUNDRY_PLAYLIST_MODES = {
  SEQUENTIAL: 0,
  SHUFFLE: 1,
  SIMULTANEOUS: 2,
  SOUNDBOARD: -1,
};

export const FOUDNRY_HOOK_IDS = {
  UPDATE_PLAYLIST: "updatePlaylist",
  CREATE_PLAYLIST: "createPlaylist",
  DELETE_PLAYLIST: "deletePlaylist",
};
