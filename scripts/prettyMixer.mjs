import { MODULE_CONFIG } from "./config.mjs";
import {
  FOUNDRY_PLAYLIST_MODES,
  getPlayingPlaylists,
  getPlaylist,
  mergeObjectWrapper,
} from "./foundryWrapper.mjs";
import { logToConsole, warnToConsole } from "./log.mjs";
import { injectSongInfo, removeSongInfo } from "./songInfo.mjs";
import { addSoundNode, removeSoundNode } from "./soundboardSoundNode.mjs";
import { TEMPLATE_IDS, getTemplatePath } from "./templates.mjs";
import { getElement } from "./utils.mjs";

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
  async activateListeners(html) {
    super.activateListeners(html);
    await this.renderInitialState();

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
   * @returns {Promise<void>}
   */
  async renderInitialState() {
    const soundboardContainerElement = this.getSoundboardSoundNodeContainer();

    const allPlayingPlaylists = getPlayingPlaylists();
    if (!allPlayingPlaylists) {
      return;
    }

    const playingSoundboards = [];
    const playingPlaylists = [];
    allPlayingPlaylists.forEach((playlist) => {
      playlist.mode === FOUNDRY_PLAYLIST_MODES.SOUNDBOARD
        ? playingSoundboards.push(playlist)
        : playingPlaylists.push(playlist);
    });

    // Soundboard sounds
    playingSoundboards.forEach((playlist) => {
      playlist.sounds.forEach(async (sound) => {
        if (sound.playing) {
          await addSoundNode(soundboardContainerElement, playlist.id, sound.id);
        }
      });
    });

    // Music
    const musicContainer = this.element.find("#song-info-anchor");
    playingPlaylists.forEach((playlist) => {
      playlist.sounds.forEach(async (sound) => {
        if (sound.playing) {
          await injectSongInfo(musicContainer, playlist.name, sound);
        }
      });
    });
  }

  async onUpdatePlaylist(origin, changes) {
    const soundboardContainerElement = this.getSoundboardSoundNodeContainer();
    const musicContainerElement = this.element.find("#song-info-anchor");

    const changedPlaylistId = changes._id;
    const changedSounds = changes.sounds;
    changedSounds?.forEach(async (sound) => {
      const playlistMode = origin.mode;
      switch (playlistMode) {
        case FOUNDRY_PLAYLIST_MODES.SOUNDBOARD:
          sound.playing
            ? await addSoundNode(
                soundboardContainerElement,
                changedPlaylistId,
                sound._id
              )
            : removeSoundNode(soundboardContainerElement, sound._id);
          break;
        case FOUNDRY_PLAYLIST_MODES.SEQUENTIAL:
        case FOUNDRY_PLAYLIST_MODES.SIMULTANEOUS:
        case FOUNDRY_PLAYLIST_MODES.SHUFFLE:
          logToConsole("FOUNDRY_PLAYLIST_MODES...");
          // todo handle playlists
          sound.playing
            ? await injectSongInfo(
                musicContainerElement,
                getPlaylist(changedPlaylistId).name,
                sound
              )
            : removeSongInfo(musicContainerElement, sound.id);
          break;
        default:
          warnToConsole(`unknown playlist mode: ${playlistMode}`);
          break;
      }
    });
  }
}
