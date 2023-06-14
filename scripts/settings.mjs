import { MODULE_CONFIG } from "./config.mjs";
import { logToConsole } from "./log.mjs";

export const SETTING_IDS = {
  ENABLED: "pm-enabled",
};

export function registerSettings() {
  game.settings.register(MODULE_CONFIG.MODULE_ID, SETTING_IDS.ENABLED, {
    name: "Enable Pretty Mixer",
    hint: "Enables module functionality",
    scope: "client", // client-stored setting
    config: true, // display in configuration view
    // requiresReload: true, // prompt user to reload application
    type: Boolean,
    // choices: {
    //   // If choices are defined, the resulting setting will be a select menu
    //   a: "Option A",
    //   b: "Option B",
    // },
    default: true,
    onChange: async (val) => {
      console.log(`${SETTING_IDS.ENABLED} changed`, { val });
    },
  });
  logToConsole("registered settings");
}
