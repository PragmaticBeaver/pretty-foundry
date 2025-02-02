import PrettyMixer from "./prettyMixer.mjs";
import { injectSidebarButton } from "./elements/sidebarButton.mjs";
import { loadMixerUi } from "./utils.mjs";
import { logToConsole } from "./log.mjs";
import { preloadTemplates } from "./templates.mjs";
import { registerIconEvents } from "./icons.mjs";
import { registerObservables } from "./observables.mjs";
import { registerSettings } from "./settings.mjs";
import { setHookDebugging } from "./foundryWrapper.mjs";

Hooks.on("init", async () => {
  setHookDebugging(false);
  logToConsole("initializing ...");
  registerSettings();
  await preloadTemplates();
});

Hooks.on("ready", () => {
  logToConsole("starting ...");
  registerObservables();
  registerIconEvents();
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
