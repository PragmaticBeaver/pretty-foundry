import {
  mergeObjectWrapper,
  getPlaylist,
  getPlayingPlaylists,
} from "./foundryWrapper.mjs";
import { MODULE_CONFIG } from "./config.mjs";
import { logToConsole } from "./log.mjs";
import { attachElementCallback } from "./utils.mjs";
import { TEMPLATE_IDS, getTemplatePath } from "./templates.mjs";

/**
 * Mixer UI controller.
 * UI can be found at /templates/prettyMixer.hbs
 * @extends Application
 */
export default class PrettyMixer extends Application {
  state = {
    intervalId: undefined,
    selectedPlaylist: undefined,
    testVal: 0,
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
   * required for template
   * https://foundryvtt.com/api/v11/classes/client.Application.html#getData
   */
  getData() {
    const currentlyPlayingSongId =
      this.state.selectedPlaylist?.playbackOrder[0];
    const currentlyPlayingSong =
      this.state.selectedPlaylist?.sounds.contents.filter((sound) => {
        return sound.id === currentlyPlayingSongId;
      })[0];

    return {
      currentlyPlayingPlaylists: getPlayingPlaylists(),
      selectedPlaylist: this.state.selectedPlaylist,
      currentlyPlayingSong,
      // currentlyPlayingSongDuration: convertMilliseconds(
      //   currentlyPlayingSong?.sound?.duration
      // ),
      currentlyPlayingSongDuration: currentlyPlayingSong?.sound?.duration | 100,
      currentlyPlayingSongProgress:
        currentlyPlayingSong?.sound?.currentTime | 0,
    };
  }

  /**
   * @override
   * https://foundryvtt.com/api/v11/classes/client.Application.html#render
   */
  async _render(force, options = {}) {
    await super._render(force, options);
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
        this.state.selectedPlaylist = playlist;
      }
    });
  }
}
