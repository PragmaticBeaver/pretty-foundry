import { hooksOnWrapper } from "./foundryWrapper.mjs";

export const PM_UPDATE_ICON_HOOK = "pm-update-icon";
export const ICON_TYPES = {
  PLAY: "play",
  PAUSE: "pause",
  STOP: "stop",
  REPEAT: "repeat",
  SHUFFLE: "shuffle",
  VOLUME: "volume",
  VOLUME_X: "volume-xmark",
  BACKWARD: "backward-step",
  FORWARD: "forward-step",
};

export function registerIconEvents() {
  hooksOnWrapper(PM_UPDATE_ICON_HOOK, $("body"), updateIcon);
}

/**
 * Update all PM icons of a given pm-id and iconType.
 * @param {string} id "pm-id" of element
 * @param {string} iconType one ICON_TYPES value
 * @param {boolean} enabled enable or disable icon
 * @returns
 */
function updateIcon(id, iconType, enabled) {
  if (!id || !iconType) return;

  const iconElements = $(`[data-pm-id="${id}"][data-icon="${iconType}"]`);
  console.log(iconElements);
  if (!iconElements?.length) return;

  const inactiveClass = "pm-inactive";
  enabled
    ? iconElements.removeClass(inactiveClass)
    : iconElements.addClass(inactiveClass);
}
