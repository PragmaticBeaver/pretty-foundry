import { MODULE_CONFIG } from "./config.mjs";
import {
  FOUNDRY_PLAYLIST_MODES,
  getPlayingPlaylists,
  getPlaylist,
  mergeObjectWrapper,
  FOUDNRY_HOOK_IDS,
  // getPlaylists,
} from "./foundryWrapper.mjs";
import { errorToConsole } from "./log.mjs";
import {
  addPlaylistNode,
  removePlaylistNode,
} from "./elements/playlistNode.mjs";
import { addSoundNode, removeSoundNode } from "./elements/soundNode.mjs";
import { TEMPLATE_IDS, getTemplatePath } from "./templates.mjs";
import { getElement } from "./utils.mjs";
import { logToConsole } from "./log.mjs";

/**
 * Mixer UI controller.
 * UI can be found at /templates/prettyMixer.hbs
 * @extends Application
 */
export default class PrettyMixer extends Application {
  hookIds = {
    update: undefined,
    create: undefined,
    delete: undefined,
  };

  ANCHOR_IDS = {
    PLAYLIST_INFO_CONTAINER: "#playlist-info-anchor",
    SOUND_NODE_CONTAINER: "#sound-node-anchor",
    PLAYLIST_NODE_CONTAINER: "#playlist-node-anchor",
    PLAYLIST_OVERVIEW_CONTAINER: "#playlist-overview-anchor",
    PLAYLIST_OVERVIEW_CONTENT_ANCHOR: "#playlist-overview-content-anchor",
    SOUNDBOARD_OVERVIEW_CONTENT_ANCHOR: "#soundboard-overview-content-anchor",
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
    // remove Hooks
    Hooks.off(FOUDNRY_HOOK_IDS.UPDATE_PLAYLIST, this.hookIds.update);
    Hooks.off(FOUDNRY_HOOK_IDS.CREATE_PLAYLIST, this.hookIds.create);
    Hooks.off(FOUDNRY_HOOK_IDS.DELETE_PLAYLIST, this.hookIds.delete);
    // todo SoundNode hooks - necessary?
  }

  /**
   * https://foundryvtt.com/api/v11/classes/client.Application.html#activateListeners
   * @param {JQuery} html
   * @override
   */
  async activateListeners(html) {
    super.activateListeners(html);
    await this.renderInitialState();

    this.hookIds.update = Hooks.on(
      FOUDNRY_HOOK_IDS.UPDATE_PLAYLIST,
      async (document, change) => await this.onUpdatePlaylist(document, change)
    );

    this.hookIds.create = Hooks.on(
      FOUDNRY_HOOK_IDS.CREATE_PLAYLIST,
      async (document, options) =>
        await this.onCreatePlaylist(document, options)
    );

    this.hookIds.delete = Hooks.on(
      FOUDNRY_HOOK_IDS.DELETE_PLAYLIST,
      async (document, options) =>
        await this.onDeletePlaylist(document, options)
    );
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
    // Controls panel
    const soundboardContainerElement = getElement(
      this.element,
      this.ANCHOR_IDS.SOUND_NODE_CONTAINER
    );

    const allPlayingPlaylists = getPlayingPlaylists();
    if (allPlayingPlaylists?.length) {
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
      const playlistContainer = getElement(
        this.element,
        this.ANCHOR_IDS.PLAYLIST_NODE_CONTAINER
      );
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

    // Overview
    const overviewElement = getElement(
      this.element,
      this.ANCHOR_IDS.PLAYLIST_OVERVIEW_CONTAINER
    );
    if (overviewElement?.length) {
      // const playlists = getPlaylists();
      // todo render initial Overview State
    }
  }

  async onUpdatePlaylist(playlistDocument, change) {
    const changedPlaylistId = change._id;
    const soundChanges = change.sounds;

    const playlist = getPlaylist(changedPlaylistId);
    if (!playlist) {
      errorToConsole(`playlist ${changedPlaylistId} not found!`);
      return;
    }

    const playlistContainer = getElement(
      this.element,
      this.ANCHOR_IDS.PLAYLIST_NODE_CONTAINER
    );

    for (const soundChange of soundChanges) {
      const soundId = soundChange._id;
      const sound = playlist.sounds.get(soundId);
      if (!sound) {
        errorToConsole(`sound ${soundId} not found!`);
        continue;
      }

      let container;
      if (playlistDocument.mode !== FOUNDRY_PLAYLIST_MODES.SOUNDBOARD) {
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
        container = getElement(
          this.element,
          this.ANCHOR_IDS.SOUND_NODE_CONTAINER
        );
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

  async onCreatePlaylist(playlistDocument, options) {
    logToConsole("onCreatePlaylist", { playlistDocument, options });
    // todo add new playlist to UI
  }

  async onDeletePlaylist(playlistDocument, options) {
    logToConsole("onDeletePlaylist", { playlistDocument, options });
    // todo remove rendered playlist form UI
  }
}
