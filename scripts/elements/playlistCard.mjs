import { renderTemplateWrapper } from "../foundryWrapper.mjs";
import { logToConsole } from "../log.mjs";
import { TEMPLATE_IDS, getTemplatePath } from "../templates.mjs";

export async function addPlaylistCard(element, name, id) {
  if (!element?.length) return;

  // create template
  const tempalte = await renderTemplateWrapper(
    getTemplatePath(TEMPLATE_IDS.PLAYLIST_CARD),
    { title: name, id }
  );
  element.append(tempalte);

  // add "click"-handler
  const card = element.find(`#${id}-playlist-card`);
  if (!card?.length) return;
  card.on("click", () => {
    // todo - open playlist info
    logToConsole(`PlaylistCard ${id} clicked`);
  });
}

export function removePlaylistCard(element, id) {
  if (!element?.length) return;

  const card = element.find(`#${id}-playlist-card`);
  if (!card?.length) return;
  card.remove();
}

export function updatePlaylistCard(element, id, name) {
  const titleElement = element
    .find(`#${id}-playlist-card`)
    .find(".playlist-card-title");
  if (!titleElement?.length) return;
  titleElement.html(name);
}
