import { renderTemplateWrapper } from "./foundryWrapper.mjs";
import { MODULE_CONFIG } from "./config.mjs";
import { errorToConsole } from "./log.mjs";
import { showMixer } from "./utils.mjs";
import { TEMPLATE_IDS, getTemplatePath } from "./templates.mjs";

export async function injectSidebarButton(html) {
  if (ui.prettyMixer.menuButtonInjected === true) {
    return;
  }

  const sidebarHeader = html.find(".directory-header");
  if (!sidebarHeader?.length) {
    errorToConsole("'.directory-header' of SidebarTab Playlists not found!");
    return;
  }

  const buttonId = "pretty-mixer-sidebar-button";
  const buttonTemplate = await renderTemplateWrapper(
    getTemplatePath(TEMPLATE_IDS.MENU_BUTTON),
    { title: MODULE_CONFIG.MODULE_NAME, id: buttonId }
  );
  sidebarHeader.append(buttonTemplate);

  const button = html.find(`#${buttonId}`); // find rendered HTML element
  button.on("click", () => {
    showMixer();
  });

  ui.prettyMixer.menuButtonInjected = true;
}
