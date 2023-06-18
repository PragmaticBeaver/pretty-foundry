import PrettyMixer from "./prettyMixer.mjs";
import { logToConsole } from "./log.mjs";
import { registerSettings } from "./settings.mjs";
import { preloadTemplates } from "./templates.mjs";
import { injectSidebarButton } from "./sidebarButton.mjs";
import { loadMixerUi } from "./utils.mjs";

Hooks.on("init", async () => {
  // CONFIG.debug.hooks = true;
  logToConsole("initializing ...");
  registerSettings();
  await preloadTemplates();
});

Hooks.on("ready", () => {
  logToConsole("starting ...");
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
