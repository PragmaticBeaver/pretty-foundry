# Pretty Mixer

## Development

### Docker setup

1. Install docker / docker desktop.
2. Pull images `docker compose pull`
3. run container `docker compose up --build -d`
4. open [localhost:30000](http://localhost:30000/)

### Manual setup

For a manual development environment add a symlink from the src directory of this repository into your FoundryVTT modules dir.

#### MacOS example

```sh
ln -s ~/src/pretty-mixer/src /Users/Beaver/Library/Application\ Support/FoundryVTT/Data/modules
```

#### Windows example

```sh
mklink /D "D:\FoundryVTT data\Data\modules\pretty-mixer\src" "E:\src\pretty-mixer"
```

## Dev notes - brain storming

Currently there are multiple ways the mixer UI can be achieved.

1. The UI could by implemented as a `SidebarTab`, similar to the standard audio interface

2. The UI could by implemented as its own `Application`-child which would provide more flexibility but needs a good UX design as it needs to be included inside the main viewport.

3. The UI could by implemented as staded in `2` but meant for use with anoter module like `PopOut!`, which allows the Mixer to be opened as another window and moved to another screen.

4. Alternatively to `3`, the `PopOut!` logic could be written by myself. Sockets seem like the best idea to do so.
