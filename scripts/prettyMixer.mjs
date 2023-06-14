import { mergeObjectWrapper } from "./foundryWrapper.mjs";
import { MODULE_CONFIG } from "./config.mjs";

/**
 * Mixer UI controller.
 * UI can be found at /templates/mixer.hbs
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
      template: `${MODULE_CONFIG.TEMPLATE_PATH}/mixer.hbs`,
      popOut: true,
      top: 0,
    });
  }

  /**
   * required for template
   * https://foundryvtt.com/api/v11/classes/client.Application.html#getData
   */
  getData() {
    // todo
    return {};
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
    // todo
  }
}
