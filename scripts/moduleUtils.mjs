import { warnToConsole } from "./log.mjs";
import PrettyMixer from "./prettyMixer.mjs";

/**
 * Loads PrettyMixer into Foundry ui-object.
 * @param {PrettyMixer} mixer
 */
export function loadMixerUi(mixer) {
  ui.prettyMixer = mixer;
}

/**
 * Renders the loaded PrettyMixer.
 */
export function showMixer() {
  if (!ui.prettyMixer) {
    warnToConsole("ui.prettyMixer not loaded!");
    return;
  }
  ui.prettyMixer.render(true);
}
