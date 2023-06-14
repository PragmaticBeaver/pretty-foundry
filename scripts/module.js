import PrettyMixer from "./prettyMixer.mjs";
import { logToConsole, infoToConsole } from "./log.mjs";
import { registerSettings, SETTING_IDS } from "./settings.mjs";
import { MODULE_CONFIG } from "./config.mjs";
import { preloadTemplates } from "./templates.mjs";
import { getSettingsValue } from "./foundryWrapper.mjs";
import { injectSidebarButton } from "./sidebarButton.mjs";
import { loadMixerUi } from "./moduleUtils.mjs";

Hooks.on("init", async () => {
  logToConsole("initializing ...");
  registerSettings();
  await preloadTemplates();
});

Hooks.on("ready", () => {
  logToConsole("starting ...");
  loadMixerUi(new PrettyMixer());
});

Hooks.on("renderSceneControls", async (app, html, data) => {
  const isModuleEnabled = getSettingsValue(
    MODULE_CONFIG.MODULE_ID,
    SETTING_IDS.ENABLED
  );
  if (!isModuleEnabled) {
    infoToConsole("module is disabled");
    return;
  }

  // render necessary scene templates
  await injectSidebarButton(html);
});

// todo - to open the HTML use this
// ui.combatCarousel.render(true);
