import { MODULE_CONFIG } from "./config.mjs";
import {
  FOUNDRY_PLAYLIST_MODES,
  getPlayingPlaylists,
  getPlaylist,
  mergeObjectWrapper,
} from "./foundryWrapper.mjs";
import { logToConsole, warnToConsole } from "./log.mjs";
import { injectSongInfo, removeSongInfo } from "./songInfo.mjs";
import { addSongNode, removeSongNode } from "./songNode.mjs";
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
    return getElement(this.element, "#pretty-mixer-sound-node-anchor");
  }

  getSongNodeContainer() {
    return getElement(this.element, "#pretty-mixer-song-node-anchor");
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
          await addSoundNode(soundboardContainerElement, sound);
        }
      });
    });

    // Music
    const musicContainer = this.element.find("#song-info-anchor");
    const songContainer = this.getSongNodeContainer();
    playingPlaylists.forEach((playlist) => {
      playlist.sounds.forEach(async (sound) => {
        if (sound.playing) {
          await injectSongInfo(musicContainer, playlist.name, sound);
          await addSongNode(songContainer, sound);
        }
      });
    });
  }

  async onUpdatePlaylist(origin, changes) {
    const changedPlaylistId = changes._id;
    const soundChanges = changes.sounds;

    logToConsole({ origin, changes });

    const playlist = getPlaylist(changedPlaylistId);
    if (!playlist) {
      warnToConsole(`playlist ${changedPlaylistId} not found`);
      return;
    }

    for (const soundChange of soundChanges) {
      const soundId = soundChange._id;
      const sound = playlist.sounds.get(soundId);
      if (!sound) {
        warnToConsole(`sound ${soundId} not found`);
        continue;
      }

      const isPlaying = soundChange.playing;

      const playlistMode = origin.mode;
      if (playlistMode === FOUNDRY_PLAYLIST_MODES.SOUNDBOARD) {
        const soundboardContainerElement =
          this.getSoundboardSoundNodeContainer();
        isPlaying
          ? await addSoundNode(soundboardContainerElement, sound)
          : removeSoundNode(soundboardContainerElement, sound.id);
      } else {
        const songContainer = this.getSongNodeContainer();
        isPlaying
          ? await addSongNode(songContainer, sound)
          : removeSongNode(songContainer, sound.id);
      }
    }
  }
}
