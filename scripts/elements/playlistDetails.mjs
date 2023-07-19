import { dialogWrapper, renderTemplateWrapper } from "../foundryWrapper.mjs";
import { logToConsole } from "../log.mjs";
import { TEMPLATE_IDS, getTemplatePath } from "../templates.mjs";
import { addSongInfo, removeSongInfoHooks } from "./songInfo.mjs";

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
      // register click handler
      const header = html.find(".playlist-details-header");
      const buttons = header.find(".playlist-details-header-icon");
      buttons.each(function () {
        const child = $(this);
        const buttonType = child.data()?.buttonType;
        switch (buttonType) {
          case "back":
            // back button
            child.on("click", async () => {
              await dialog.close();
            });
            break;
          case "add":
            // add button
            child.on("click", () => {
              const dialog = new PlaylistSound(
                { name: game.i18n.localize("SOUND.New") },
                { parent: playlist }
              );
              dialog.sheet.render(true);
            });
            break;
          case "edit":
            // edit button
            child.on("click", () => {
              const dialog = new PlaylistConfig(playlist);
              dialog.render(true);
            });
            break;
          default:
            break;
        }
      });

      // render initial state
      const body = html.find(".playlist-details-body");
      playlist?.sounds?.forEach(async (sound) => {
        await addSongInfo(body, sound);
      });
    },
    (html) => {
      // remove Hooks
      const body = html.find(".playlist-details-body");
      playlist?.sounds?.forEach((sound) => {
        removeSongInfoHooks(body, sound.id);
      });
    }
  );
  dialog.render(true);
}
