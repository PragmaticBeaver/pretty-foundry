/**
 * !!! DEV-INFO !!!
 * The following wrapper functions are mainly used for type support inside other files.
 */
import { errorToConsole, logToConsole } from "./log.mjs";

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
        logToConsole({ html });
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

  const element = $(mixerElement);
  element.addClass(styles);

  const content = element.find(".window-content");
  content.addClass(styles);
}
