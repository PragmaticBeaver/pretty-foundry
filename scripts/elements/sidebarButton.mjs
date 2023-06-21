import { MODULE_CONFIG } from "../config.mjs";
import { renderTemplateWrapper } from "../foundryWrapper.mjs";
import { errorToConsole } from "../log.mjs";
import { TEMPLATE_IDS, getTemplatePath } from "../templates.mjs";
import { isPrettyMixerRendered, showMixer } from "../utils.mjs";

export async function injectSidebarButton(html) {
  const buttonId = "pretty-mixer-sidebar-button";

  const sidebarHeader = html.find(".directory-header");
  if (!sidebarHeader?.length) {
    errorToConsole("'.directory-header' of SidebarTab Playlists not found!");
    return;
  }

  const isRendered = html.find(`#${buttonId}`)?.length > 0;
  if (isRendered) {
    return;
  }

  const buttonTemplate = await renderTemplateWrapper(
    getTemplatePath(TEMPLATE_IDS.MENU_BUTTON),
    { title: MODULE_CONFIG.MODULE_NAME, id: buttonId }
  );
  sidebarHeader.append(buttonTemplate);

  const button = html.find(`#${buttonId}`); // find rendered HTML element
  button.on("click", () => {
    if (isPrettyMixerRendered()) return;
    showMixer();
  });
}
