/**
 * Component for displaying details of a single playlist and controls for said playlist.
 */
import {
  FOUNDRY_PLAYLIST_MODES,
  renderTemplateWrapper,
} from "../foundryWrapper.mjs";
import { TEMPLATE_IDS, getTemplatePath } from "../templates.mjs";
import { openPlaylistDetailsDialog } from "./playlistDetails.mjs";

export async function addPlaylistCard(element, playlist) {
  if (!element?.length) return;
  const { name, id } = playlist;

  // create template
  const tempalte = await renderTemplateWrapper(
    getTemplatePath(TEMPLATE_IDS.PLAYLIST_CARD),
    { title: name, id }
  );
  element.append(tempalte);

  // "click"-handler
  const cardElement = element.find(`#${id}-playlist-card`);
  // open dialog
  if (!cardElement?.length) return;
  const bufferElement = cardElement.find(".playlist-card-buffer");
  bufferElement.on("click", async () => {
    await openPlaylistDetailsDialog(playlist);
  });
  const titleElement = cardElement.find(".playlist-card-title");
  titleElement.on("click", async () => {
    await openPlaylistDetailsDialog(playlist);
  });
  // play/stop button
  const playButton = cardElement.find('*[data-icon="play"]');
  playButton.on("click", async () => {
    if (playlist.mode === FOUNDRY_PLAYLIST_MODES.SIMULTANEOUS) {
      await playlist.playAll();
    } else {
      // single playback
      const sound = playlist.sounds.contents[0];
      await playlist.playSound(sound);
    }
  });
  const stopButton = cardElement.find('*[data-icon="stop"]');
  stopButton.on("click", async () => {
    await playlist.stopAll();
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
  const playlistCardElement = element.find(`#${id}-playlist-card`);
  if (!playlistCardElement?.length) return;

  const playButton = playlistCardElement.find('*[data-icon="play"]');
  const stopButton = playlistCardElement.find('*[data-icon="stop"]');

  const inactiveClass = "pm-inactive";
  if (isPlaying) {
    stopButton.removeClass(inactiveClass);
    playButton.addClass(inactiveClass);
  } else {
    playButton.removeClass(inactiveClass);
    stopButton.addClass(inactiveClass);
  }
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
