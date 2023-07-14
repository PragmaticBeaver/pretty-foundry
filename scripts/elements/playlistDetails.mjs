import { dialogWrapper, renderTemplateWrapper } from "../foundryWrapper.mjs";
import { logToConsole } from "../log.mjs";
import { TEMPLATE_IDS, getTemplatePath } from "../templates.mjs";

export async function openPlaylistDetailsDialog(playlist) {
  const title = playlist.name;
  const template = await renderTemplateWrapper(
    getTemplatePath(TEMPLATE_IDS.PLAYLIST_DETAILS),
    { title }
  );
  const dialog = await dialogWrapper(
    title,
    template,
    (html) => {
      // todo register click handler
      // todo render songInfo's
      logToConsole({ html });
    },
    () => logToConsole(`closed ${title}`)
  );
  dialog.render(true);
  logToConsole({ dialog });
}
