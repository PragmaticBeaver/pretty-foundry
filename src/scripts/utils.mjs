import { warnToConsole } from "./log.mjs";

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
 * Update ProgressBar-Element "width" by calculating the Sound progress.
 * @param {jQuery} element Element which holds data-attributes (currentTime, duration) and will be updated
 * @param {Record<string,any>} update FoundryVTT update-object
 * @returns {void}
 */
export function updateProgressBar(element, update) {
  const state = element.data();
  const { prop, returnVal } = update;

  const shouldIgnoreUpdate =
    !["currentTime", "duration"].includes(prop) || !returnVal;
  if (shouldIgnoreUpdate) return;
  state[prop] = returnVal;

  const { currentTime, duration } = state;
  if (!currentTime || !duration) return; // only update if both are set

  const calculatedProgress = Math.min((currentTime / duration) * 100, 100);
  element.css("width", `${calculatedProgress}%`);
}

/**
 * Set active icon inactive and vice versa.
 * @param {jQuery} element playPause icon container
 * @param {boolean} isPlaying switch to Play-icon
 * @returns {void}
 */
export function switchPlayPause(element, isPlaying = undefined) {
  if (!element?.length) return;

  const playIcon = element.find(".fa-play");
  const pauseIcon = element.find(".fa-pause");
  if (!playIcon?.length || !pauseIcon?.length) return;

  const inactiveClass = "pm-inactive";
  const playing = isPlaying ? isPlaying : pauseIcon.hasClass(inactiveClass);
  if (playing) {
    playIcon.addClass(inactiveClass);
    pauseIcon.removeClass(inactiveClass);
  } else {
    pauseIcon.addClass(inactiveClass);
    playIcon.removeClass(inactiveClass);
  }
}

/**
 * Cycle active icon.
 * @param {jQuery} container element containing icons to switch active / inactive
 * @param {string} inactiveClass optional class to search and set for inactivity
 * @returns
 */
export function cycleIcon(container, inactiveClass = "pm-inactive") {
  if (!container?.length) return;

  const activeElement = container.find(`:not(.${inactiveClass})`);
  const index = activeElement.index();
  const children = container.children();
  const length = children?.length;
  const nextIndex = index + 1 === length ? 0 : index + 1;

  activeElement.addClass(inactiveClass);
  const nextElement = children.eq(nextIndex);
  nextElement.removeClass(inactiveClass);
}

/**
 * Add or remove class depending on wether the class is present or not.
 * @param {jQuery} element which should hold the class
 * @param {string} className class to toggle
 */
export function cycleClass(element, className) {
  element.hasClass(className)
    ? element.removeClass(className)
    : element.addClass(className);
}
