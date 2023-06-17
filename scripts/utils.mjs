import { warnToConsole } from "./log.mjs";

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

export function isPrettyMixerRendered() {
  return ui.prettyMixer?.rendered;
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

/**
 * @param {number} ms milliseconds to convert
 * @returns {string} timestamp for example "2:17"
 */
export function convertToTimestamp(ms) {
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
      const obj = { target, prop, receiver, returnVal };
      callAll ? Hooks.callAll(getHook, obj) : Hooks.call(getHook, obj);
      return returnVal;
    },
    set(target, key, value) {
      const success = Reflect.set(target, { key, value });
      const obj = { target, key, value };
      callAll ? Hooks.callAll(setHook, obj) : Hooks.call(setHook, obj);
      return success;
    },
  };
  return new Proxy(target, handler);
}
