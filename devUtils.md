# Code snippets

## Elements

Prettier does not support partials which is why they aren't used. Small, reusable elements will be part of this list.

### Icons

#### play

```hbs
<div class="pm-icon" data-icon="play">
  <i class="fas fa-play"></i>
</div>
```

#### pause

```hbs
<div class="pm-icon" data-icon="pause">
  <i class="fas fa-pause"></i>
</div>
```

### play/pause

```hbs
<div class="pm-icon" data-icon="playPause">
  <i class="fas fa-play"></i>
  <i class="fas fa-pause pm-inactive"></i>
</div>
```

#### repeat

```hbs
<div class="pm-icon" data-icon="repeat">
  <i class="fas fa-repeat"></i>
</div>
```

#### shuffle

```hbs
<div class="pm-icon" data-icon="shuffle">
  <i class="fas fa-shuffle"></i>
</div>
```

#### volume

```hbs
<div class="pm-icon" data-icon="volume">
  <i class="fas fa-volume"></i>
</div>
```

#### backward-step

```hbs
<div class="pm-icon" data-icon="backward-step">
  <i class="fas fa-backward-step"></i>
</div>
```

#### forward-step

```hbs
<div class="pm-icon" data-icon="forward-step">
  <i class="fas fa-forward-step"></i>
</div>
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
