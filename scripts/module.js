import { injectSidebarButton } from "./elements/sidebarButton.mjs";
import { setHookDebugging } from "./foundryWrapper.mjs";
import { logToConsole } from "./log.mjs";
import { registerObservables } from "./observables.mjs";
import PrettyMixer from "./prettyMixer.mjs";
import { registerSettings } from "./settings.mjs";
import { preloadTemplates } from "./templates.mjs";
import { loadMixerUi } from "./utils.mjs";

Hooks.on("init", async () => {
  setHookDebugging(false);
  logToConsole("initializing ...");
  registerSettings();
  await preloadTemplates();
});

Hooks.on("ready", () => {
  logToConsole("starting ...");
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
