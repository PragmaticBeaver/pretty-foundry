import { renderTemplateWrapper } from "./foundryWrapper.mjs";
import { logToConsole } from "./log.mjs";
import { TEMPLATE_IDS, getTemplatePath } from "./templates.mjs";

export async function injectSongInfo(element, playlistName, song) {
  logToConsole({ playlistName, song });
  // create template
  const soundNodeTemplate = await renderTemplateWrapper(
    getTemplatePath(TEMPLATE_IDS.SONG_INFO),
    { playlistName, songName: song.name, id: song.id }
  );
  element.append(soundNodeTemplate);
}

export function removeSongInfo(element, songId) {
  element.find(`#song-info-${songId}`).remove();
}
