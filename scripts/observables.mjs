// import { makeObservable } from "./utils.mjs";

export const GLOBAL_HOOK_IDS = {
  SET_PLAYLIST: "pm-setPlaylist",
  GET_PLAYLIST: "pm-getPlaylist",
};

/**
 * Register package wide observables for FoundryVTT properties.
 */
export function registerGlobalObservables() {
  // Playlists
  // game.playlists = makeObservable(
  //   game.playlists,
  //   GLOBAL_HOOK_IDS.GET_PLAYLIST,
  //   GLOBAL_HOOK_IDS.SET_PLAYLIST
  // );
}
