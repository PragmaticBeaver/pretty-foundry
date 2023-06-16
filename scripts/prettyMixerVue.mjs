import {
  mergeObjectWrapper,
  getPlayingPlaylists,
  getPlaylist,
} from "./foundryWrapper.mjs";
import { MODULE_CONFIG } from "./config.mjs";
import { errorToConsole, logToConsole } from "./log.mjs";

import { VueApplication } from "./../lib/petiteVueWrapper.mjs";
import { createApp, reactive } from "./../lib/petite-vue0.4.1.mjs";

/**
 * Mixer UI controller relying on petite-vue for reactivity.
 * UI can be found at /templates/prettyMixer.vue
 * @extends Application
 */
export class PrettyMixerVue extends VueApplication {
  /**
   * @override
   */
  static get defaultOptions() {
    return mergeObjectWrapper(super.defaultOptions, {
      id: MODULE_CONFIG.MODULE_ID,
      template: `${MODULE_CONFIG.TEMPLATE_PATH}/prettyMixer.vue`,
      popOut: true,
      top: 0,
    });
  }

  /**
   * required for template
   * https://foundryvtt.com/api/v11/classes/client.Application.html#getData
   */
  getData() {
    return {
      currentlyPlayingPlaylists: getPlayingPlaylists(),
      selectedPlaylist: undefined,
      currentlyPlayingSong: undefined,
      currentlyPlayingSongDuration: undefined,
      currentlyPlayingSongProgress: undefined,
    };
  }
}
