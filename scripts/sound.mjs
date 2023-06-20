/**
 * Update ProgressBar-Element "width" by calculating the Sound progress.
 * @param {jQuery} element Element which holds data-attributes (currentTime, duration) and will be updated
 * @param {*} update FoundryVTT object update
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
