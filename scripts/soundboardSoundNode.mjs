import { getPlaylist, renderTemplateWrapper } from "./foundryWrapper.mjs";
import { logToConsole, warnToConsole } from "./log.mjs";
import { TEMPLATE_IDS, getTemplatePath } from "./templates.mjs";
import { makeObservable } from "./utils.mjs";

function registerHooks(progressElement) {
  const state = progressElement.data();

  // getSound
  const getHookId = Hooks.on("getSound", (update) => {
    const { prop, returnVal } = update;
    const shouldIgnoreUpdate =
      !["currentTime", "duration"].includes(prop) || !returnVal;
    if (shouldIgnoreUpdate) return;
    state[prop] = returnVal;

    const { currentTime, duration } = state;
    if (!currentTime || !duration) return;
    const calculatedProgress = Math.min((currentTime / duration) * 100, 100);
    progressElement.css("width", `${calculatedProgress}%`);
  });

  state["getHookId"] = getHookId;

  // setSound
  const setHookId = Hooks.on("setSound", (update) => logToConsole(update));
  state["setHookId"] = setHookId;
}

/**
 * Adds SoundboardSoundNode as child to element.
 * @param {jQuery} element to add new SoundbardSoundNode to
 * @param {string} playlistId PlaylistID of sound
 * @param {string} soundId ID of sound to add
 * @returns {Promise<void>}
 */
export async function addAmbienceNode(element, playlistId, soundId) {
  if (!element?.length) {
    return;
  }
  // const containerElement = getElement(
  //   element,
  //   "#pretty-mixer-ambience-node-container"
  // );
  // if (!containerElement) return;

  const playlist = getPlaylist(playlistId);
  if (!playlist) {
    warnToConsole(`playlist ${playlistId} not found`);
    return;
  }
  // logToConsole({ playlist });

  const sound = playlist.sounds.get(soundId);
  if (!sound) {
    warnToConsole(`sound ${soundId} not found`);
    return;
  }

  // create template
  const ambienceNodeTemplate = await renderTemplateWrapper(
    getTemplatePath(TEMPLATE_IDS.SOUNDBOARD_SOUND_NODE),
    { label: sound.name, id: `ambience-node-${soundId}` }
  );
  element.append(ambienceNodeTemplate);

  const progressElement = element.find(`#ambience-node-${soundId}-progress`);
  registerHooks(progressElement);

  // replace sound-obj with Proxy
  sound.sound = makeObservable(sound.sound, "getSound", "setSound", false, {
    soundId: sound.id,
  });
}

/**
 * Removes rendered SoundboardSoundNode from element.
 * @param {jQuery} element parent of SoundbardSoundNode to remove
 * @param {string} soundId ID of sound-obj of rendered SoundbardSoundNode to remove
 * @returns {void}
 */
export function removeAmbienceNode(element, soundId) {
  if (!element?.length) return;

  const soundboardElement = element.find(`#ambience-node-${soundId}`);
  if (!soundboardElement?.length) {
    return;
  }

  const { getHookId, setHookId } = soundboardElement.data();
  Hooks.off("getSound", getHookId);
  Hooks.off("setSound", setHookId);

  soundboardElement.remove();
}
