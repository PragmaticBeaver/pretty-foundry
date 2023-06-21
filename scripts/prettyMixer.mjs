import { MODULE_CONFIG } from "./config.mjs";
import {
  FOUNDRY_PLAYLIST_MODES,
  getPlayingPlaylists,
  getPlaylist,
  mergeObjectWrapper,
} from "./foundryWrapper.mjs";
import { errorToConsole } from "./log.mjs";
import {
  addPlaylistNode,
  removePlaylistNode,
} from "./elements/playlistNode.mjs";
import { addSoundNode, removeSoundNode } from "./elements/soundNode.mjs";
import { TEMPLATE_IDS, getTemplatePath } from "./templates.mjs";
import { getElement } from "./utils.mjs";

/**
 * Mixer UI controller.
 * UI can be found at /templates/prettyMixer.hbs
 * @extends Application
 */
export default class PrettyMixer extends Application {
  updatePlaylistHookId = undefined;
  ANCHOR_IDS = {
    PLAYLIST_INFO_CONTAINER: "#playlist-info-anchor",
    SOUND_NODE_CONTAINER: "#sound-node-anchor",
    PLAYLIST_NODE_CONTAINER: "#playlist-node-anchor",
  };
  DYNAMIC_ANCHOR_ID_PARTS = {
    PLAYLIST_NODE: "-playlist-node",
    SOUND_NODE: "-sound-node",
  };

  /**
   * Converts a static DYNAMIC_ANCHOR_ID_PARTS value to its dynamic counterpart.
   * @param {*} dynamicAnchorIdPart value of DYNAMIC_ANCHOR_ID_PARTS
   * @param {string} id Sound or Playlist ID
   * @returns {string}
   */
  buildAnchorId(dynamicAnchorIdPart, id) {
    return `#${id}${dynamicAnchorIdPart}`;
  }

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
      async (...args) => await this.onUpdatePlaylist(...args) // todo enable
    );
  }

  getSoundNodeContainer() {
    return getElement(this.element, this.ANCHOR_IDS.SOUND_NODE_CONTAINER);
  }

  getPlaylistNodeContainer() {
    return getElement(this.element, this.ANCHOR_IDS.PLAYLIST_NODE_CONTAINER);
  }

  getSoundNodeOfPlaylistNode(playlistContainer, id) {
    const query = this.buildAnchorId(
      this.DYNAMIC_ANCHOR_ID_PARTS.PLAYLIST_NODE,
      id
    );
    const nodeContainer = playlistContainer
      .find(query)
      .find(".playlist-node-sound-container");
    if (!nodeContainer?.length) {
      errorToConsole(`"playlist-node-song-container" of "${query}" not found!`);
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

    // sort Playlist by type
    allPlayingPlaylists.forEach((playlist) => {
      playlist.mode === FOUNDRY_PLAYLIST_MODES.SOUNDBOARD
        ? playingSoundboards.push(playlist)
        : playingPlaylists.push(playlist);
    });

    // Soundboard Sounds
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

      let container;
      if (origin.mode !== FOUNDRY_PLAYLIST_MODES.SOUNDBOARD) {
        const playlistId = playlist.id;
        const query = this.buildAnchorId(
          this.DYNAMIC_ANCHOR_ID_PARTS.PLAYLIST_NODE,
          playlistId
        );
        const isPlaylistRendered = playlistContainer.find(query);
        if (!isPlaylistRendered?.length) {
          await addPlaylistNode(playlistContainer, playlist);
        }
        container = this.getSoundNodeOfPlaylistNode(
          playlistContainer,
          playlistId
        );
      } else {
        container = this.getSoundNodeContainer();
      }
      if (!container) {
        errorToConsole("unable to find SoundContainer!");
        continue;
      }

      // handle single Sound in Playlist with repeat setting (will be set to playing === true, but already playing)
      const soundQuery = this.buildAnchorId(
        this.DYNAMIC_ANCHOR_ID_PARTS.SOUND_NODE,
        soundId
      );
      const continuePlaying =
        soundChange.playing && this.element.find(soundQuery)?.length;
      if (continuePlaying) return;

      // add or remove SoundNode
      soundChange.playing
        ? await addSoundNode(container, sound)
        : removeSoundNode(container, sound.id);
    }

    // stop Playlist after stopping Sounds (because Sounds need to remove Hooks first)
    if (!playlist.playing) {
      removePlaylistNode(playlistContainer, playlist.id);
    }
  }
}
