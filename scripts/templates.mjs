import { MODULE_CONFIG } from "./config.mjs";
import { loadTemplatesWrapper } from "./foundryWrapper.mjs";
import { logToConsole } from "./log.mjs";

export const TEMPLATE_IDS = {
  MIXER: "mixer",
  MENU_BUTTON: "menuButton",
  SOUNDBOARD_SOUND_NODE: "soundboardSoundNode",
  SONG_INFO: "songInfo",
  SONG_NODE: "songNode",
};

/**
 * @param {string} templateId one ID of TEMPLATE_IDS
 * @returns {string}
 */
export function getTemplatePath(templateId) {
  return {
    [TEMPLATE_IDS.MIXER]: `${MODULE_CONFIG.TEMPLATES_PATH}/prettyMixer.hbs`,
    [TEMPLATE_IDS.MENU_BUTTON]: `${MODULE_CONFIG.TEMPLATES_PATH}/openButton.hbs`,
    [TEMPLATE_IDS.SOUNDBOARD_SOUND_NODE]: `${MODULE_CONFIG.TEMPLATES_PATH}/soundboardSoundNode.hbs`,
    [TEMPLATE_IDS.SONG_INFO]: `${MODULE_CONFIG.TEMPLATES_PATH}/songInfo.hbs`,
    [TEMPLATE_IDS.SONG_NODE]: `${MODULE_CONFIG.TEMPLATES_PATH}/songNode.hbs`,
  }[templateId];
}

export async function preloadTemplates() {
  logToConsole("preloading templates ...");
  await loadTemplatesWrapper([
    getTemplatePath(TEMPLATE_IDS.MIXER),
    getTemplatePath(TEMPLATE_IDS.MENU_BUTTON),
    getTemplatePath(TEMPLATE_IDS.SOUNDBOARD_SOUND_NODE),
    getTemplatePath(TEMPLATE_IDS.SONG_INFO),
    getTemplatePath(TEMPLATE_IDS.SONG_NODE),
  ]);
}
