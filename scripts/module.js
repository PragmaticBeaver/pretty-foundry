import PrettyMixer from "./prettyMixer.mjs";
import { logToConsole, warnToConsole } from "./log.mjs";
import { registerSettings } from "./settings.mjs";
import { preloadTemplates } from "./templates.mjs";
import { injectSidebarButton } from "./sidebarButton.mjs";
import { loadMixerUi } from "./utils.mjs";
import { registerCustomHooks } from "./customHooks.mjs";
import { registerObservables } from "./observables.mjs";
import { FOUNDRY_PLAYLIST_MODES } from "./foundryWrapper.mjs";

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
  const playlistsId = "playlists";
  if (sidebarTab.id === playlistsId) {
    await injectSidebarButton(sidebarTab.element);
  }
});

Hooks.on("renderSidebarTab", async (sidebarTab) => {
  const playlistsId = "playlists";
  if (sidebarTab.id === playlistsId) {
    await injectSidebarButton(sidebarTab.element);
  }
});
