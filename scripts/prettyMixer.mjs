import { MODULE_CONFIG } from "./config.mjs";
import {
  FOUNDRY_PLAYLIST_MODES,
  getPlayingPlaylists,
  getPlaylist,
  mergeObjectWrapper,
} from "./foundryWrapper.mjs";
import { errorToConsole, logToConsole } from "./log.mjs";
import { addPlaylistNode, removePlaylistNode } from "./playlistNode.mjs";
import { addSoundNode, removeSoundNode } from "./soundNode.mjs";
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

  getSoundNodeContainer() {
    return getElement(this.element, "#pretty-mixer-sound-node-anchor");
  }

  getPlaylistNodeContainer() {
    return getElement(this.element, "#pretty-mixer-playlist-node-anchor");
  }

  getSoundNodeOfPlaylistNode(playlistContainer, id) {
    logToConsole({ playlistContainer, id });
    const nodeContainer = playlistContainer
      .find(`#playlist-node-${id}`)
      .find(".playlist-node-sound-container");
    if (!nodeContainer?.length) {
      errorToConsole(
        `"playlist-node-song-container" of "#playlist-node-${id}" not found!`
      );
      return;
    }
    return nodeContainer;
  }

  /**
   * Inject initial state after first render.
   * @returns {Promise<void>}
   */
  async renderInitialState() {
    const soundboardContainerElement = this.getSoundNodeContainer();

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
    const playlistContainer = this.getPlaylistNodeContainer();
    playingPlaylists.forEach(async (playlist) => {
      await addPlaylistNode(playlistContainer, playlist);
      // add Sounds
      playlist.sounds.forEach(async (sound) => {
        if (sound.playing) {
          const playlistSongContainer = this.getSoundNodeOfPlaylistNode(
            playlistContainer,
            playlist.id
          );
          await addSoundNode(playlistSongContainer, sound);
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
      errorToConsole(`playlist ${changedPlaylistId} not found!`);
      return;
    }

    const playlistContainer = this.getPlaylistNodeContainer();

    for (const soundChange of soundChanges) {
      const soundId = soundChange._id;
      const sound = playlist.sounds.get(soundId);
      if (!sound) {
        errorToConsole(`sound ${soundId} not found!`);
        continue;
      }

      const container =
        origin.mode === FOUNDRY_PLAYLIST_MODES.SOUNDBOARD
          ? this.getSoundNodeContainer()
          : this.getSoundNodeOfPlaylistNode(playlistContainer, playlist.id);
      if (!container) {
        errorToConsole("unable to find SoundContainer!");
        continue;
      }

      soundChange.playing
        ? await addSoundNode(container, sound)
        : removeSoundNode(container, sound.id);
    }

    // stop playlist after stopping sounds (because sounds need to remove Hooks first)
    if (!playlist.playing) {
      removePlaylistNode(playlistContainer, playlist.id);
    }
  }
}
