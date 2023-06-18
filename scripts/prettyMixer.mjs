import {
  mergeObjectWrapper,
  FOUNDRY_PLAYLIST_MODES,
  getPlayingPlaylists,
} from "./foundryWrapper.mjs";
import { MODULE_CONFIG } from "./config.mjs";
import { logToConsole, warnToConsole } from "./log.mjs";
import { TEMPLATE_IDS, getTemplatePath } from "./templates.mjs";
import { getElement } from "./utils.mjs";
import { addSoundNode, removeSoundNode } from "./soundboardSoundNode.mjs";

/**
 * Mixer UI controller.
 * UI can be found at /templates/prettyMixer.hbs
 * @extends Application
 */
export default class PrettyMixer extends Application {
  updatePlaylistHookId = undefined;

  /**
   * @override
   */
  static get defaultOptions() {
    return mergeObjectWrapper(super.defaultOptions, {
      id: MODULE_CONFIG.MODULE_ID,
      template: getTemplatePath(TEMPLATE_IDS.MIXER),
      popOut: true,
      top: 0,
      width: 800,
      height: 800,
    });
  }

  /**
   * @override
   * https://foundryvtt.com/api/classes/client.Application.html#close
   * @param {*} [options]
   * @returns {Promise<void>}
   */
  async close(options) {
    await super.close(options);
    Hooks.off("updatePlaylist", this.updatePlaylistHookId);
  }

  /**
   * https://foundryvtt.com/api/v11/classes/client.Application.html#activateListeners
   * @param {JQuery} html
   * @override
   */
  activateListeners(html) {
    super.activateListeners(html);
    this.renderInitialState();

    this.updatePlaylistHookId = Hooks.on(
      "updatePlaylist",
      async (...args) => await this.onUpdatePlaylist(...args)
    );
  }

  getSoundboardSoundNodeContainer() {
    return getElement(this.element, "#pretty-mixer-sound-node-container");
  }

  /**
   * Inject initial state after first render.
   * @returns {void}
   */
  renderInitialState() {
    const containerElement = this.getSoundboardSoundNodeContainer();
    if (!containerElement) return;

    const playingPlaylists = getPlayingPlaylists().filter(
      (playlist) => playlist.mode === FOUNDRY_PLAYLIST_MODES.SOUNDBOARD
    );
    if (!playingPlaylists) {
      return;
    }

    // Soundboard sounds
    playingPlaylists.forEach((playlist) => {
      playlist.sounds.forEach(async (sound) => {
        if (sound.playing) {
          await addSoundNode(containerElement, playlist.id, sound.id);
        }
      });
    });

    // todo current track / playlist
  }

  async onUpdatePlaylist(origin, changes) {
    const containerElement = this.getSoundboardSoundNodeContainer();
    if (!containerElement) return;

    const changedPlaylistId = changes._id;
    const changedSounds = changes.sounds;
    changedSounds?.forEach(async (sound) => {
      const playlistMode = origin.mode;
      switch (playlistMode) {
        case FOUNDRY_PLAYLIST_MODES.SOUNDBOARD:
          sound.playing
            ? await addSoundNode(containerElement, changedPlaylistId, sound._id)
            : removeSoundNode(containerElement, sound._id);
          break;
        case FOUNDRY_PLAYLIST_MODES.SEQUENTIAL:
        case FOUNDRY_PLAYLIST_MODES.SIMULTANEOUS:
        case FOUNDRY_PLAYLIST_MODES.SHUFFLE:
          logToConsole("FOUNDRY_PLAYLIST_MODES...");
          // todo handle playlists
          break;
        default:
          warnToConsole(`unknown playlist mode: ${playlistMode}`);
          break;
      }
    });
  }
}
