import PrettyMixer from "./prettyMixer.mjs";
import { logToConsole, infoToConsole } from "./log.mjs";
import { registerSettings, SETTING_IDS } from "./settings.mjs";
import { MODULE_CONFIG } from "./config.mjs";
import { preloadTemplates } from "./templates.mjs";
import { getSettingsValue } from "./foundryWrapper.mjs";
import { injectSidebarButton } from "./sidebarButton.mjs";
import { loadMixerUi } from "./utils.mjs";

Hooks.on("init", async () => {
  logToConsole("initializing ...");
  registerSettings();
  await preloadTemplates();
});

Hooks.on("ready", () => {
  logToConsole("starting ...");
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

Hooks.on("getPlaylists", (...args) => {
  logToConsole("HOOK => getPlaylists", args);
  // const { target, prop } = args;
});

Hooks.on("setPlaylists", (...args) => {
  logToConsole("HOOK => setPlaylists", args);
  // const { target, key, value } = args;
});
