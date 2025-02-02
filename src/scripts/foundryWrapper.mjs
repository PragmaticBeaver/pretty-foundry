/**
 * !!! DEV-INFO !!!
 * The following wrapper functions are mainly used for type support inside other files.
 */
import { errorToConsole } from "./log.mjs";

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
 * @param {string} id playlist ID
 * @returns {Playlist | undefined}
 */
export function getPlaylist(id) {
  return game?.playlists?.get(id);
}

/**
 * Wrapper of "FoundryVTT game.playlists.getName" function
 * @param {string} name playlist name
 * @returns {Playlist | undefined}
 */
export function getPlaylistByName(name) {
  return game?.playlists?.getName(name);
}

export const FOUNDRY_PLAYLIST_MODES = {
  SEQUENTIAL: 0,
  SHUFFLE: 1,
  SIMULTANEOUS: 2,
  SOUNDBOARD: -1,
};

/**
 * Wrapper of "FoundryVTT Dialog" constructor
 * @param {string} title dialog title
 * @param {string} template preloaded template (use 'renderTemplateWrapper' function)
 * @param {(html: jQuery) => void} renderCallback optional callback for dialog render function
 * @param {(html: jQuery) => void} closeCallback optional callback for dialog close function
 * @param {Record<string, any>} buttons optional config for dialog buttons
 * @returns {Promise<Dialog>}
 */
export async function dialogWrapper(
  title,
  template,
  renderCallback = undefined,
  closeCallback = undefined,
  buttons = undefined
) {
  const dialog = new Dialog(
    {
      title,
      content: template,
      buttons: !buttons ? {} : buttons, // will error if not set to object
      render: (html) => {
        !buttons ? html.last()?.addClass("pm-force-inactive") : undefined;
        overrideApplicationStyles(dialogId);
        renderCallback && renderCallback(html);
      },
      close: (html) => closeCallback && closeCallback(html),
    },
    {
      top: 0,
      width: 800,
      height: 800,
    }
  );
  const dialogId = dialog.id;
  return dialog;
}

export function overrideApplicationStyles(appId) {
  const mixerElement = $.find(`#${appId}`);
  if (!mixerElement?.length) {
    errorToConsole(`${appId} not found, style override not possible!`);
    return;
  }

  const styles = [
    "pm-force-background-none",
    // "pm-force-box-shadow-none"
  ];

  // remove content background
  const element = $(mixerElement);
  const content = element.find(".window-content");
  content.addClass(styles);
}

/**
 *  Custom wrapper for FoundryVTT Document.update function.
 * @param {Document} target FoundryVTT Document to update
 * @param {Record<string,any>} value object with properties & values to update
 * @returns {Promise<Document>} updated Document
 */
export async function updateWrapper(target, value) {
  return await target.update(value);
}

export const FOUDNRY_HOOK_IDS = {
  // Playlist
  UPDATE_PLAYLIST: "updatePlaylist",
  CREATE_PLAYLIST: "createPlaylist",
  DELETE_PLAYLIST: "deletePlaylist",
  // Sound
  UPDATE_PLAYLIST_SOUND: "updatePlaylistSound",
};

/**
 * Custom wrapper for FoundryVTT Hooks.on function, which will set hook-ID as Data-Attribute.
 * @param {string} hook name of hook
 * @param {jQuery} element element which will hold the hook-ID as state using Data-Attibute
 * @param {(...props) => Promise<void>} callback will be called on hook events
 */
export function hooksOnWrapper(hook, element, callback) {
  if (!hook || !element?.length || !callback) return;

  const hookId = Hooks.on(hook, async (...props) => await callback(...props));
  const state = element.data();
  state[hook] = hookId;
}

/**
 *  Custom wrapper for FoundryVTT Hooks.off function, which will use hook-ID from Data-Attribute to remove hook.
 * @param {string} hook name of hook
 * @param {jQuery} element element which holds the hook-ID as state using Data-Attibute
 */
export function hooksOffWrapper(hook, element) {
  if (!hook || !element?.length) return;

  const hookId = element.data()[hook];
  if (!hookId) return;

  Hooks.off(hook, hookId);
}

/**
 * Wrapper of FoundryVTT Hooks.call function
 * @param {string} hook
 * @param  {...any} props
 */
export function hooksCallWrapper(hook, ...props) {
  Hooks.call(hook, ...props);
}
