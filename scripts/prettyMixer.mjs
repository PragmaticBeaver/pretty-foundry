import {
  mergeObjectWrapper,
  getPlaylist,
  FOUNDRY_PLAYLIST_MODES,
  renderTemplateWrapper,
  getPlayingPlaylists,
} from "./foundryWrapper.mjs";
import { MODULE_CONFIG } from "./config.mjs";
import { errorToConsole, logToConsole, warnToConsole } from "./log.mjs";
import { TEMPLATE_IDS, getTemplatePath } from "./templates.mjs";
import { makeObservable } from "./utils.mjs";

/**
 * Mixer UI controller.
 * UI can be found at /templates/prettyMixer.hbs
 * @extends Application
 */
export default class PrettyMixer extends Application {
  state = {
    updatePlaylistHookId: undefined,
    getSoundHookIds: [],
    setSoundHookIds: [],
    ambienceSoundProgress: {},
  };

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
   * @override
   * https://foundryvtt.com/api/v11/classes/client.Application.html#render
   */
  render(force, options = {}) {
    super.render(force, options);
  }

  /**
   * @override
   * https://foundryvtt.com/api/classes/client.Application.html#close
   * @param {*} [options]
   * @returns {Promise<void>}
   */
  async close(options) {
    await super.close(options);

    Hooks.off("updatePlaylist", this.state.updatePlaylistHookId);

    // remove ambienceNode hooks
    this.state.getSoundHookIds.forEach((hookId) =>
      Hooks.off("getSound", hookId)
    );
    this.state.setSoundHookIds.forEach((hookId) =>
      Hooks.off("setSound", hookId)
    );
  }

  /**
   * https://foundryvtt.com/api/v11/classes/client.Application.html#activateListeners
   * @param {JQuery} html
   * @override
   */
  activateListeners(html) {
    super.activateListeners(html);
    this.renderInitialState();

    this.state.updatePlaylistHookId = Hooks.on(
      "updatePlaylist",
      async (...args) => await this.onUpdatePlaylist(...args)
    );

    // todo refactor click handler
    // const activePlaylists = html.find(
    //   ".pretty-mixer-global-audio-controls-queue-element"
    // );
    // attachElementCallback(activePlaylists, "click", (e) => {
    //   const id = e?.currentTarget?.dataset?.playlistId;
    //   const playlist = getPlaylist(id);
    //   if (playlist) {
    //     logToConsole("clicked on", { playlist });
    //   }
    // });
  }

  /**
   * Inject initial state after first render.
   * @returns {void}
   */
  renderInitialState() {
    const containerElement = this.getMixerNode();
    if (!containerElement) return;

    const playingPlaylists = getPlayingPlaylists().filter(
      (playlist) => playlist.mode === FOUNDRY_PLAYLIST_MODES.SOUNDBOARD
    );
    if (!playingPlaylists) {
      return;
    }

    // ambience
    playingPlaylists.forEach((playlist) => {
      playlist.sounds.forEach(async (sound) => {
        if (sound.playing) {
          await this.addAmbienceNode(playlist.id, sound.id);
        }
      });
    });

    // logToConsole({ playingPlaylists });
    // todo current track / playlist
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

  async addAmbienceNode(playlistId, soundId) {
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

    // register ambienceNode Hooks
    const getHookId = Hooks.on("getSound", (update) => {
      const { prop, returnVal, passthrough } = update;
      const soundId = passthrough.soundId;

      const progressElement = containerElement.find(
        `#ambience-node-${soundId}-progress`
      );
      if (!progressElement?.length || !returnVal) return;

      logToConsole({
        prop,
        returnVal,
        state: this.state.ambienceSoundProgress,
      });

      if (["currentTime", "duration"].includes(prop)) {
        this.state.ambienceSoundProgress[soundId]
          ? (this.state.ambienceSoundProgress[soundId][prop] = returnVal)
          : (this.state.ambienceSoundProgress[soundId] = { [prop]: returnVal });

        const currentProgress = this.state.ambienceSoundProgress[soundId];
        logToConsole({
          currentTime: currentProgress.currentTime,
          duration: currentProgress.duration,
        });

        const calculatedProgress = Math.min(
          (currentProgress.currentTime / currentProgress.duration) * 100,
          100
        );
        progressElement.css("width", `${calculatedProgress}%`);
      }
    });
    this.state.getSoundHookIds.push(getHookId);

    const setHookId = Hooks.on("setSound", (update) => logToConsole(update));
    sound.sound = makeObservable(sound.sound, "getSound", "setSound", false, {
      soundId: sound.id,
    });
    this.state.getSoundHookIds.push(setHookId);

    // create template
    const ambienceNodeTemplate = await renderTemplateWrapper(
      getTemplatePath(TEMPLATE_IDS.AMBIENCE_NODE),
      { label: sound.name, id: `ambience-node-${soundId}` }
    );
    containerElement.append(ambienceNodeTemplate);
  }

  removeAmbienceNode(soundId) {
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
            ? await this.addAmbienceNode(changedPlaylistId, sound._id)
            : this.removeAmbienceNode(sound._id);
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
