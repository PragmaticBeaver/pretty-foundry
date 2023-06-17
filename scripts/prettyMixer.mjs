import {
  mergeObjectWrapper,
  getPlaylist,
  FOUNDRY_PLAYLIST_MODES,
  renderTemplateWrapper,
} from "./foundryWrapper.mjs";
import { MODULE_CONFIG } from "./config.mjs";
import { errorToConsole, logToConsole, warnToConsole } from "./log.mjs";
import { attachElementCallback } from "./utils.mjs";
import { TEMPLATE_IDS, getTemplatePath } from "./templates.mjs";

/**
 * Mixer UI controller.
 * UI can be found at /templates/prettyMixer.hbs
 * @extends Application
 */
export default class PrettyMixer extends Application {
  constructor(options = {}) {
    super(options);
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
    });
  }

  /**
   * required for template
   * https://foundryvtt.com/api/v11/classes/client.Application.html#getData
   */
  getData() {
    // const currentlyPlayingSongId =
    //   this.state.selectedPlaylist?.playbackOrder[0];
    // const currentlyPlayingSong =
    //   this.state.selectedPlaylist?.sounds.contents.filter((sound) => {
    //     return sound.id === currentlyPlayingSongId;
    //   })[0];

    return {
      // currentlyPlayingPlaylists: getPlayingPlaylists(),
      // selectedPlaylist: this.state.selectedPlaylist,
      // currentlyPlayingSong,
      // // currentlyPlayingSongDuration: convertMilliseconds(
      // //   currentlyPlayingSong?.sound?.duration
      // // ),
      // currentlyPlayingSongDuration: currentlyPlayingSong?.sound?.duration | 100,
      // currentlyPlayingSongProgress:
      //   currentlyPlayingSong?.sound?.currentTime | 0,
    };
  }

  /**
   * @override
   * https://foundryvtt.com/api/v11/classes/client.Application.html#render
   */
  render(force, options = {}) {
    super.render(force, options);

    Hooks.on(
      "updatePlaylist",
      async (...args) => await this.onUpdatePlaylist(...args)
    );
  }

  /**
   * @override
   * https://foundryvtt.com/api/classes/client.Application.html#close
   * @param {*} [options]
   * @returns {Promise<void>}
   */
  async close(options) {
    await super.close(options);

    Hooks.off("updatePlaylist", (...args) => this.onUpdatePlaylist(...args));
  }

  /**
   * https://foundryvtt.com/api/v11/classes/client.Application.html#activateListeners
   * @param {JQuery} html
   */
  activateListeners(html) {
    super.activateListeners(html);

    const activePlaylists = html.find(
      ".pretty-mixer-global-audio-controls-queue-element"
    );
    attachElementCallback(activePlaylists, "click", (e) => {
      const id = e?.currentTarget?.dataset?.playlistId;
      const playlist = getPlaylist(id);
      if (playlist) {
        logToConsole("clicked on", { playlist });
      }
    });
  }

  getMixerNode() {
    const containerElement = this.element.find(
      "#pretty-mixer-ambience-node-container"
    );
    if (!containerElement?.length) {
      errorToConsole("'#pretty-mixer-ambience-node-container' not found!");
      return;
    }
    return containerElement;
  }

  async addAmbienceElement(playlistId, soundId) {
    const containerElement = this.getMixerNode();
    if (!containerElement) return;

    const playlist = getPlaylist(playlistId);
    if (!playlist) {
      warnToConsole(`playlist ${playlistId} not found`);
      return;
    }
    // logToConsole({ playlist });
    const sound = playlist.sounds.get(soundId);
    if (!sound) {
      warnToConsole(`song ${soundId} not found`);
      return;
    }
    // logToConsole({ sound });

    const ambienceNodeTemplate = await renderTemplateWrapper(
      getTemplatePath(TEMPLATE_IDS.AMBIENCE_NODE),
      { label: sound.name, id: `ambience-node-${soundId}` }
    );
    containerElement.append(ambienceNodeTemplate);
  }

  removeAmbienceElement(soundId) {
    const containerElement = this.getMixerNode();
    if (!containerElement) return;

    const ambienceNode = containerElement.find(`#ambience-node-${soundId}`);
    if (!ambienceNode?.length) {
      return;
    }
    ambienceNode.remove();
  }

  async onUpdatePlaylist(origin, changes, uiState, id, ...args) {
    logToConsole("updatePlaylist", { origin, changes, uiState, id, args });

    const changedPlaylistId = changes._id;
    const changedSounds = changes.sounds;
    changedSounds?.forEach(async (sound) => {
      const playlistMode = origin.mode;
      switch (playlistMode) {
        case FOUNDRY_PLAYLIST_MODES.SOUNDBOARD:
          sound.playing
            ? await this.addAmbienceElement(changedPlaylistId, sound._id)
            : this.removeAmbienceElement(sound._id);
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
