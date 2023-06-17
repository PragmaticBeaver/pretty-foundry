import PrettyMixer from "./prettyMixer.mjs";
import { logToConsole, infoToConsole } from "./log.mjs";
import { registerSettings, SETTING_IDS } from "./settings.mjs";
import { MODULE_CONFIG } from "./config.mjs";
import { preloadTemplates } from "./templates.mjs";
import { getSettingsValue } from "./foundryWrapper.mjs";
import { injectSidebarButton } from "./sidebarButton.mjs";
import { loadMixerUi } from "./utils.mjs";
import { registerCustomHooks } from "./customHooks.mjs";
import { registerObservables } from "./observables.mjs";

Hooks.on("init", async () => {
  // CONFIG.debug.hooks = true;
  logToConsole("initializing ...");
  registerSettings();
  await preloadTemplates();
});

Hooks.on("ready", () => {
  logToConsole("starting ...");
  registerCustomHooks();
  registerObservables();
  loadMixerUi(new PrettyMixer());
});

Hooks.on("changeSidebarTab", async (sidebarTab) => {
  const isModuleEnabled = getSettingsValue(
    MODULE_CONFIG.MODULE_ID,
    SETTING_IDS.ENABLED
  );
  if (!isModuleEnabled) {
    infoToConsole("module is disabled");
    return;
  }

  const playlistsId = "playlists";
  const id = sidebarTab.id;

  if (id === playlistsId) {
    // switched to SidebarTab "Playlists"
    const element = sidebarTab.element;
    await injectSidebarButton(element);
  }
});
