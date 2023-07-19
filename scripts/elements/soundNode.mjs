import {
  getPlayingPlaylists,
  hooksOff,
  hooksOn,
  renderTemplateWrapper,
} from "../foundryWrapper.mjs";
import { CUSTOM_HOOKS } from "../observables.mjs";
import { TEMPLATE_IDS, getTemplatePath } from "../templates.mjs";
import { stopSound, updateProgressBar } from "../utils.mjs";

function registerHooks(progressElement, soundId) {
  // getSound
  hooksOn(CUSTOM_HOOKS.getSound, progressElement, (update) => {
    const updateId = update?.passthrough?.soundId;
    if (!updateId || updateId !== soundId) return;
    updateProgressBar(progressElement, update);
  });
}

/**
 * Adds SoundNode as child to element.
 * @param {jQuery} element to add new SoundbardSoundNode to
 * @param {string} playlistId PlaylistID of sound
 * @param {string} soundId ID of sound to add
 * @returns {Promise<void>}
 */
export async function addSoundNode(element, sound) {
  if (!element?.length) return;
  const soundId = sound.id;

  // create template
  const soundNodeTemplate = await renderTemplateWrapper(
    getTemplatePath(TEMPLATE_IDS.SOUNDBOARD_SOUND_NODE),
    { label: sound.name, id: soundId }
  );
  element.append(soundNodeTemplate);

  // add "click"-handler
  const container = element.find(`#${soundId}-sound-node`);
  if (!container?.length) return;
  container.on("click", async () => {
    await stopSound(getPlayingPlaylists(), soundId);
  });

  // register custom Hooks (emitted by observable)
  const progressElement = container.find(`#${soundId}-sound-node-progress`);
  registerHooks(progressElement, soundId);
}

/**
 * Removes rendered SoundNode from element.
 * @param {jQuery} element parent of SoundbardSoundNode to remove
 * @param {string} soundId ID of Sound-obj of rendered SoundbardSoundNode to remove
 * @returns {void}
 */
export function removeSoundNode(element, soundId) {
  if (!element?.length) return;

  const soundNode = element.find(`#${soundId}-sound-node`);
  if (!soundNode?.length) return;

  const soundProgress = soundNode.find(`#${soundId}-sound-node-progress`);
  hooksOff(CUSTOM_HOOKS.getSound, soundProgress);
  soundNode.remove();
}
