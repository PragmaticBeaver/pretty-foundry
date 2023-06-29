import { logToConsole } from "./log.mjs";
import PrettyMixer from "./prettyMixer.mjs";
import { registerSettings } from "./settings.mjs";
import { injectSidebarButton } from "./elements/sidebarButton.mjs";
import { preloadTemplates } from "./templates.mjs";
import { loadMixerUi } from "./utils.mjs";
import { registerGlobalObservables } from "./observables.mjs";
import { setHookDebugging } from "./foundryWrapper.mjs";

Hooks.on("init", async () => {
  setHookDebugging(false);
  logToConsole("initializing ...");
  registerSettings();
  await preloadTemplates();
});

Hooks.on("ready", () => {
  logToConsole("starting ...");
  loadMixerUi(new PrettyMixer());
  registerGlobalObservables();
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
