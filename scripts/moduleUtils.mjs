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

/**
 *
 * @param {HTMLElement | HTMLElement[]} elements one or many HTMLElements
 * @param {string} type event type to listen for
 * @param {function(e):void} callback
 */
export function attachElementCallback(elements, type, callback) {
  if (Array.isArray(elements)) {
    elements.forEach((playlist) => {
      playlist.on(type, (e) => {
        callback(e);
      });
    });
  } else {
    elements.on(type, (e) => {
      callback(e);
    });
  }
}

export function convertMilliseconds(ms) {
  var minutes = Math.floor(ms / 60000);
  var seconds = ((ms % 60000) / 1000).toFixed(0);
  console.log({ ms, minutes, seconds });
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}
