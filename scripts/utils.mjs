import { logToConsole, warnToConsole } from "./log.mjs";
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

/**
 * Wraps a target object in a Proxy, so that every update can be tracked.
 * The Proxy will emit events using FoundryVTT-Hooks.
 * @param {Record<string,any>} target
 * @param {string} getHook will emit { target, prop, receiver, returnVal }
 * @param {string} setHook will emit { target, key, value }
 * @param {boolean} [callAll=false] switch between Hooks.call and Hooks.callAll (see FoundryVTT docs for more information).
 * @returns {Proxy}
 */
export function makeObservable(target, getHook, setHook, callAll = false) {
  const handler = {
    get(target, prop, receiver) {
      const val = Reflect.get(target, prop);
      const returnVal = typeof val === "function" ? val.bind(target) : val;
      Hooks.call(getHook, { target, prop, receiver, returnVal });
      return returnVal;
    },
    set(target, key, value) {
      const success = Reflect.set(target, { key, value });
      Hooks.call(setHook, { target, key, value });
      return success;
    },
  };
  return new Proxy(target, handler);
}
