import { renderTemplateWrapper } from "./foundryWrapper.mjs";
import { TEMPLATE_IDS, getTemplatePath } from "./templates.mjs";

export async function injectSongInfo(element, playlistName, songName) {
  // create template
  const soundNodeTemplate = await renderTemplateWrapper(
    getTemplatePath(TEMPLATE_IDS.SONG_INFO),
    { playlistName, songName }
  );
  element.append(soundNodeTemplate);
}
