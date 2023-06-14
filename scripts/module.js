import { logToConsole } from "./log.mjs";
import { registerSettings } from "./settings.mjs";
import { preloadTemplates } from "./templates.mjs";
import PrettyMixer from "./mixer.mjs";

Hooks.on("init", async () => {
  logToConsole("initializing ...");
  registerSettings();
  await preloadTemplates();
  // todo
  logToConsole("initialized");
});

Hooks.on("ready", () => {
  logToConsole("starting ...");
  // todo
  ui.prettyMixer = new PrettyMixer();
  logToConsole("started");
});
