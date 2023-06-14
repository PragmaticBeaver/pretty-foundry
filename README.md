# Pretty Mixer

## Development

For a simple development environment add a symlink from the root directory of this repository into your FoundryVTT modules dir.

#### MacOS example

```bash
ln -s ~/src/pretty-mixer/ /Users/Beaver/Library/Application\ Support/FoundryVTT/Data/modules
```

### Windows example

```bash
mklink /D "D:\FoundryVTT data\Data\modules\pretty-mixer" "E:\src\pretty-mixer"
```

## Dev notes - brain storming

Currently there are multiple ways the mixer UI can be achieved.

1. The UI could by implemented as a `SidebarTab`, similar to the standard audio interface

2. The UI could by implemented as its own `Application`-child which would provide more flexibility but needs a good UX design as it needs to be included inside the main viewport.

3. The UI could by implemented as staded in `2` but meant for use with anoter module like `PopOut!`, which allows the Mixer to be opened as another window and moved to another screen.

4. Alternatively to `3`, the `PopOut!` logic could be written by myself. Sockets seem like the best idea to do so.
