import { loadTemplatesWrapper } from "./foundryWrapper.mjs";
import { MODULE_CONFIG } from "./config.mjs";
import { logToConsole } from "./log.mjs";

export const TEMPLATE_IDS = {
  MIXER: "mixer",
};

export async function preloadTemplates() {
  logToConsole("preloading templates ...");
  await loadTemplatesWrapper({
    [TEMPLATE_IDS.MIXER]: `${MODULE_CONFIG.TEMPLATE_PATH}/prettyMixer.html`,
  });
}
