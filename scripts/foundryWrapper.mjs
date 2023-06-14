/**
 * !!! DEV-INFO !!!
 * The following wrapper functions are mainly used for type support inside other files.
 */

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
 * @returns Promise<Function[]>
 */
export async function loadTemplatesWrapper(templates) {
  return await loadTemplates(templates);
}

/**
 * Wrapper of "FoundryVTT ClientSettings" get function
 * @param {string} moduleId
 * @param {string} settingId
 * @returns any
 */
export function getSettingsValue(moduleId, settingId) {
  return game.settings.get(moduleId, settingId);
}
