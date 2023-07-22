import {
  hooksOffWrapper,
  hooksOnWrapper,
  renderTemplateWrapper,
  updateWrapper,
} from "../foundryWrapper.mjs";
import { CUSTOM_HOOKS } from "../observables.mjs";
import { TEMPLATE_IDS, getTemplatePath } from "../templates.mjs";
import { cycleClass, cycleIcon } from "../utils.mjs";

function registerHooks(volumeBar, songId) {
  // getSound
  hooksOnWrapper(CUSTOM_HOOKS.getSound, volumeBar, (update) => {
    // update from FoundryVTT-slider to PM-slider
    const soundId = update?.passthrough?.soundId;
    if (!soundId || soundId !== songId) return;

    const ignoreUpdate = update.prop !== "play";
    if (ignoreUpdate) return;

    const foundryInputVolume = $()
      ?.find(`*[data-sound-id="${songId}"]`)
      ?.find("input")
      ?.val();
    if (!foundryInputVolume && foundryInputVolume !== 0) return;

    const volumeBarVolume = $(volumeBar)?.val();
    if (foundryInputVolume === volumeBarVolume) return;

    $(volumeBar).val(foundryInputVolume);
  });
}

export async function addSongInfo(element, song) {
  if (!element?.length) return;
  const id = song.id;

  // create template
  const template = await renderTemplateWrapper(
    getTemplatePath(TEMPLATE_IDS.SONG_INFO),
    { id, name: song.name, currentVolume: song.volume }
  );
  element.append(template);

  // event handling => updates from PM-slider to FoundryVTT-slider

  const songInfo = element.find(`#${id}-song-info`);
  if (!songInfo?.length) return;

  // volume-bar
  const volumeBar = songInfo.find(".pm-volume-bar");
  volumeBar.on("input", (event) => {
    const element = $(event.target);
    const value = Number(element?.val());
    updateVolume(song, value);
    switchVolumeIcon(volumeButton, value > 0);
  });

  // volume button
  const volumeButton = songInfo.find('*[data-icon="volume"]');
  volumeButton?.on("click", () => {
    const val = Number($(volumeBar)?.val());
    const newVolume = val > 0 ? 0.0 : 1.0;
    $(volumeBar)?.val(newVolume);
    updateVolume(song, newVolume);
    switchVolumeIcon(volumeButton, newVolume > 0);
  });
  // set initial volume icon
  switchVolumeIcon(volumeButton, song.effectiveVolume > 0);

  // repeat button
  const repeatButton = songInfo.find('*[data-icon="repeat"]');
  repeatButton?.on("click", async () => {
    cycleClass(repeatButton, "pm-enabled");
    // update Song value
    await updateWrapper(song, { repeat: !song.repeat });
    // update FoundryVTT repeat icon
    const soundControls = $(`*[data-sound-id="${id}"]`)?.find(".sound-control");
    if (!soundControls?.length) return;
    song.repeat
      ? soundControls.removeClass("inactive")
      : soundControls.addClass("inactive");
  });
  // set inital repeat icon
  if (song.repeat) {
    cycleClass(repeatButton, "pm-enabled");
  }

  // play/pause button
  const playButton = songInfo.find('*[data-icon="play"]');
  playButton?.on("click", async () => {
    if (song.playing) {
      await updateWrapper(song, {
        playing: false,
        pausedTime: song.sound.currentTime,
      });
    } else {
      const playlist = song.parent;
      playlist.playSound(song);
    }

    cycleIcon(playButton);
  });
  // set initial play/pause icon
  if (song.playing) {
    cycleIcon(playButton);
  }

  // register custom Hooks (emitted by observable)
  registerHooks(volumeBar, id);
}

export function removeSongInfoHooks(element, id) {
  const volumeBar = element.find(`#${id}-song-info`)?.find(".pm-volume-bar");
  hooksOffWrapper(CUSTOM_HOOKS.getSound, volumeBar);
}

/**
 * Hack for FoundryVTT volume update of slider and sound.
 * Necessary because sound.debounceVolume() function doesn't update UI.
 * @param {Sound} sound Sound-obj of FoundryVTT
 * @param {number} volume volume between 0.0 and 1.0.
 */
function updateVolume(sound, volume) {
  const soundId = sound.id;
  $($.find("#currently-playing"))
    ?.find(`*[data-sound-id="${soundId}"]`)
    ?.find("input")
    ?.val(volume);
  sound.debounceVolume(volume);
}

function switchVolumeIcon(container, enabled) {
  const volEnabledIcon = container.find(".fa-volume");
  const volDisabledIcon = container.find(".fa-volume-xmark");
  const inactiveClass = "pm-inactive";
  if (enabled) {
    volEnabledIcon.removeClass(inactiveClass);
    volDisabledIcon.addClass(inactiveClass);
  } else {
    volEnabledIcon.addClass(inactiveClass);
    volDisabledIcon.removeClass(inactiveClass);
  }
}
