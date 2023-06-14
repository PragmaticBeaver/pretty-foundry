import { renderTemplateWrapper } from "./foundryWrapper.mjs";
import { MODULE_CONFIG } from "./config.mjs";
import { errorToConsole, logToConsole } from "./log.mjs";
import { showMixer } from "./moduleUtils.mjs";

export async function injectSidebarButton(html) {
  const mainControls = html.find(".control-tools.main-controls");
  if (!mainControls?.length) {
    errorToConsole("'.control-tools.main-controls' not found!");
    return;
  }

  const dataControlId = "pretty-mixer-sidebar-button";
  const buttonTemplate = await renderTemplateWrapper(
    `${MODULE_CONFIG.TEMPLATE_PATH}/menuButton.hbs`,
    { title: MODULE_CONFIG.MODULE_NAME, dataControlId }
  );
  mainControls.append(buttonTemplate);

  const button = html.find(`li[data-control='${dataControlId}']`); // find rendered HTML element
  logToConsole({ button });
  button.on("click", (_event) => {
    showMixer();
  });
}
