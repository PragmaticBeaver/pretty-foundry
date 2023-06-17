/**
 * @file Part of custom reactivity framework. Registers observables that will call custom FoundryVTT-Hooks.
 */

import { CUSTOM_HOOK_ID } from "./customHooks.mjs";
import { logToConsole } from "./log.mjs";

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

/**
 * Registers observables that will call custom FoundryVTT-Hooks.
 */
export function registerObservables() {
  // Playlists
  game.playlists = makeObservable(
    game.playlists,
    CUSTOM_HOOK_ID.GET_PLAYLISTS,
    CUSTOM_HOOK_ID.SET_PLAYLISTS
  );
  logToConsole("game.playlists", game.playlists);
}
