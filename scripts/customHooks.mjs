/**
 * @file Part of custom reactivity framework. Listens for custom hooks to handle data & UI refreshes.
 */

import { logToConsole } from "./log.mjs";

/**
 * IDs for custom FoundryVTT-Hooks.
 */
export const CUSTOM_HOOK_ID = {
  GET_PLAYLISTS: "getPlaylists",
  SET_PLAYLISTS: "setPlaylists",
};

/**
 * Listens for custom FoundryVTT-Hooks to handle data & UI refreshes.
 */
export function registerCustomHooks() {
  Hooks.on("getPlaylists", (args) => {
    logToConsole("HOOK => getPlaylists", { args });
  });

  Hooks.on("setPlaylists", (args) => {
    logToConsole("HOOK => setPlaylists", { args });
  });
}
