import { renderTemplateWrapper } from "../foundryWrapper.mjs";
import { logToConsole } from "../log.mjs";
import { TEMPLATE_IDS, getTemplatePath } from "../templates.mjs";

function anchorIds() {
  return {
    STATIC: {
      PLAYLIST_OVERVIEW: "#playlist-overview",
      PLAYLIST_CONTENT_ANCHOR: "#playlist-overview-content-anchor",
      SOUNDBOARD_DONTENT_ANCHOR: "#soundboard-overview-content-anchor",
    },
    DYNAMIC_PARTIAL: {
      // PLAYLIST_NODE: "-playlist-node",
      // SOUND_NODE: "-sound-node",
    },
  };
}

function registerHooks(element) {
  const hookId = Hooks.on("createPlaylist", (document, options) => {
    logToConsole({ document, options });
    // todo add new playlist to UI
  });
  const state = element.data();
  state["hookId"] = hookId;
}

function renderInitialState(playlists) {
  // todo
  logToConsole({ playlists });
}

export async function addPlaylistOverview(element, playlists) {
  if (!element?.length) return;

  // create template
  const template = await renderTemplateWrapper(
    getTemplatePath(TEMPLATE_IDS.PLAYLIST_OVERVIEW)
  );
  element.append(template);

  renderInitialState(playlists);
  registerHooks(element);
}

export function removePlaylistOverview(element) {
  const overview = element.find(anchorIds().STATIC.PLAYLIST_OVERVIEW);
  if (!overview) return;

  const { hookId } = overview.data();
  Hooks.off("createPlaylist", hookId);
  overview.remove();
}

function addPlaylistCard() {
  // todo
  // "click"-handler => open playlist details
}

function removePlaylistCard() {
  // todo
}
