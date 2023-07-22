# Code snippets

## Elements

Prettier does not support partials which is why they aren't used. Small, reusable elements will be part of this list.

### Icons

```html
<!-- play -->
<i class="pm-icon fas fa-play" data-pm-id="{{id}}" data-icon="play"></i>

<!-- pause -->
<i class="pm-icon fas fa-pause" data-pm-id="{{id}}" data-icon="pause"></i>

<!-- stop -->
<i class="pm-icon fas fa-stop" data-pm-id="{{id}}" data-icon="stop"></i>

<!-- shuffle -->
<i class="pm-icon fas fa-shuffle" data-pm-id="{{id}}" data-icon="shuffle"></i>

<!-- repeat -->
<i class="pm-icon fas fa-repeat" data-pm-id="{{id}}" data-icon="repeat"></i>

<!-- volume -->
<i class="pm-icon fas fa-volume" data-pm-id="{{id}}" data-icon="volume"></i>

<!-- volume-x -->
<i
  class="pm-icon fas fa-volume-xmark"
  data-pm-id="{{id}}"
  data-icon="volume-xmark"
></i>

<!-- backward -->
<i
  class="pm-icon fas fa-backward-step"
  data-pm-id="{{id}}"
  data-icon="backward-step"
></i>

<!-- forward -->
<i
  class="pm-icon fas fa-forward-step"
  data-pm-id="{{id}}"
  data-icon="forward-step"
></i>
```

## Find FoundryVTT code

The following is a snip from a Moderator of the FoundryVTT Discord;

> First, I used the browser data inspector to look at the `<a>` that is the actual clickable button, I saw `data-action="sound-create"` in there and recognized the pattern core Foundry uses for indicating which action to fire in an Application.
> Then I searched `foundry.js` for sound-create and found it in `PlaylistDirectory.activateListeners` (which is where I would expect to find the listeners for the playlist sidebar tab) and saw it pointing at `this._onSoundCreate`, which led me to this function (which I chopped up a bit to give you a more relevant example)

```js
_onSoundCreate(event) {
  const li = $(event.currentTarget).parents('.playlist');
  const playlist = game.playlists.get(li.data("documentId"));
  const sound = new PlaylistSound({name: game.i18n.localize("SOUND.New")}, {parent: playlist});
  sound.sheet.render(true, {top: li[0].offsetTop, left: window.innerWidth - 670});
}
```
