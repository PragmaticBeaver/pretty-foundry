import {
  FOUNDRY_PLAYLIST_MODES,
  renderTemplateWrapper,
} from "../foundryWrapper.mjs";
import { logToConsole } from "../log.mjs";
import { TEMPLATE_IDS, getTemplatePath } from "../templates.mjs";
import { switchPlayPause } from "../utils.mjs";

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

export function updatePlaylistCardTitle(element, id, title) {
  const titleElement = element
    .find(`#${id}-playlist-card`)
    .find(".playlist-card-title");
  if (!titleElement?.length) return;
  titleElement.html(title);
}

export function updatePlaylistCardButton(element, id, isPlaying) {
  const buttonElement = element.find(`#${id}-playlist-card`).find(".pm-icon");
  if (!buttonElement?.length) return;

  switchPlayPause(buttonElement, isPlaying);
}

export function updatePlaylistCardMode(element, id, mode) {
  const ICON_MAP = {
    [FOUNDRY_PLAYLIST_MODES.SEQUENTIAL]: "fa-arrow-alt-circle-right",
    [FOUNDRY_PLAYLIST_MODES.SHUFFLE]: "fa-random",
    [FOUNDRY_PLAYLIST_MODES.SIMULTANEOUS]: "fa-compress-arrows-alt",
    [FOUNDRY_PLAYLIST_MODES.SOUNDBOARD]: "fa-ban",
  };

  const iconContainer = element
    .find(`#${id}-playlist-card`)
    .find(".playlist-card-mode-icon");
  if (!iconContainer?.length) return;

  const inactiveClass = "pm-inactive";
  const children = iconContainer.find("i");
  children.each(function () {
    const child = $(this);
    const activeIconClass = ICON_MAP[mode];
    if (child.hasClass(activeIconClass)) {
      child.removeClass(inactiveClass);
    } else if (!child.hasClass(inactiveClass)) {
      child.addClass(inactiveClass);
    }
  });
}
