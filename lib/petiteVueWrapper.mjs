import { createApp, reactive } from "./petite-vue0.4.1.mjs";

export class VueApplication extends Application {
  store = undefined;
  _vueApp = undefined;
  _vueUtils = {
    cache: new Map(),
    getTemplate: async (templateUrl) => {
      if (this._vueUtils.cache.has(templateUrl)) {
        return this._vueUtils.cache.get(templateUrl);
      }

      let template;
      try {
        const response = await fetch(templateUrl);
        template = await response.text();
      } catch (error) {
        errorToConsole(error);
        return;
      }
      this._vueUtils.setTemplate(templateUrl, template);
      return this._vueUtils.cache.get(templateUrl);
    },
    setTemplate: (templateUrl, template) => {
      this._vueUtils.cache.set(templateUrl, template);
    },
  };

  constructor(options = {}) {
    super(options);
  }

  /**
   * Enables reactive behavior.
   * @override Override private method, otherwise Vue wont work.
   * @param {any} data Receives the data of getData()
   * @returns {Promise<jQuery>}
   */
  async _renderInner(data) {
    const template = await this._vueUtils.getTemplate(this.template);
    if (!template) {
      throw Error(`Error fetching template ${this.template}`);
    }

    const container = document.createElement("div");
    container.innerHTML = `<div class="vue-application">${template}</div>`;

    this.store = reactive(data);
    const vueElement = container.firstChild;
    return $(vueElement); //return as jQuery (as intended by FoundryVTT)
  }

  /**
   *
   * @override Override private method, otherwise Vue wont work.
   * @param {jQuery} html
   */
  _activateCoreListeners(html) {
    super._activateCoreListeners(html);

    const element = html[0];
    this._vueApp = createApp().mount(
      element.querySelector(".window-content > div")
    );
  }
}
