import { errorToConsole, warnToConsole } from "./log.mjs";

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
 * Stops a specific sound by id.
 * @param {[]} playingPlaylists playlists to search through.
 * @param {string} id ID of the Sound to stop.
 * @returns {Promise<void>}
 */
export async function stopSound(playingPlaylists, id) {
  playingPlaylists.forEach((playlist) => {
    playlist.sounds.forEach(async (sound) => {
      if (sound.id === id && sound.playing) {
        return await playlist.stopSound(sound);
      }
    });
  });
}

/**
 *
 * @param {jQuery} rootElement ancestor element
 * @param {string} searchQuery jQuery search query
 * @returns {jQuery | undefined}
 */
export function getElement(rootElement, searchQuery) {
  const element = rootElement?.find(searchQuery);
  if (!element?.length) {
    return;
  }
  return element;
}

// /**
//  * @param {number} ms milliseconds to convert
//  * @returns {string} timestamp for example "2:17"
//  */
// export function convertToTimestamp(ms) {
//   var minutes = Math.floor(ms / 60000);
//   var seconds = ((ms % 60000) / 1000).toFixed(0);
//   console.log({ ms, minutes, seconds });
//   return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
// }

/**
 * Wraps a target object in a Proxy, so that every update can be tracked.
 * The Proxy will emit events using FoundryVTT-Hooks.
 * @param {Record<string,any>} target
 * @param {string} getHook will emit { target, prop, receiver, returnVal, passthrough }
 * @param {string} setHook will emit { target, key, value, passthrough }
 * @param {boolean} [callAll=false] switch between Hooks.call and Hooks.callAll (see FoundryVTT docs for more information).
 * @param {*} passthrough will be passed through to subscriber
 * @returns {Proxy}
 */
export function makeObservable(
  target,
  getHook,
  setHook,
  callAll = false,
  passthrough
) {
  const handler = {
    get(target, prop, receiver) {
      const val = Reflect.get(target, prop);
      const returnVal = typeof val === "function" ? val.bind(target) : val;
      const obj = { target, prop, receiver, returnVal, passthrough };
      callAll ? Hooks.callAll(getHook, obj) : Hooks.call(getHook, obj);
      return returnVal;
    },
    set(target, key, value) {
      const success = Reflect.set(target, { key, value });
      const obj = { target, key, value, passthrough };
      callAll ? Hooks.callAll(setHook, obj) : Hooks.call(setHook, obj);
      return success;
    },
  };
  return new Proxy(target, handler);
}
