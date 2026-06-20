# Panini FIFA World Cup 2026 Monorepo Sticker Manager

**🌐 Use it here:** [https://guidsdo.github.io/sticker-manager/](https://guidsdo.github.io/sticker-manager/)

> No installation or account needed. Your collection is stored in your browser's local storage — as long as you use the same browser, your data persists. Use the Export feature to back it up.
>
> **Using multiple devices?** Browser local storage does not sync across devices, even with a signed-in Chrome or Edge account. Use **Export** on one device and **Import** on another to transfer your collection. For seamless cross-device sync, you can self-host the included backend server instead.

## How to Use the Website

1. **Select a Country:** Click on a country from the sidebar to view its sticker album.
2. **View Stickers:** Browse your collection organized by sticker number with a grid layout.
3. **Mark Stickers:** Click on sticker cards to mark them as collected or missing from your album.
4. **Team Switching:** Use the team buttons at the top to quickly navigate between different national teams.
5. **Import/Export:**
    - **Export:** Save your collection as a JSON file to back up your progress or import into [laststicker.com](https://www.laststicker.com/).
    - **Import:** Load a previously saved collection file to restore or merge data.
6. **View Statistics:** Check your collection completion stats and progress at a glance.

## ⚠️ Disclaimer

**This project is a fan-made collection tracker tool and is NOT affiliated with, endorsed by, or associated with:**

- FIFA (Fédération Internationale de Football Association)
- Panini Group or any Panini brands
- Any national football federation or governing body
- laststicker.com or any other organization, company, or website

This is an independent, open-source project created for personal use and educational purposes. All trademarks, logos, team names, and sticker images referenced belong to their respective owners. This project does not distribute, sell, or claim ownership of any copyrighted material.

---

This repository is a pnpm + Turborepo monorepo with three projects under `packages`:

- `packages/contracts`: shared dataset + TypeScript contracts
- `packages/client`: React + MobX frontend
- `packages/server`: Express + SQLite API server
- `packages/messagebus`: typed Electron IPC channels between preload and main
- `packages/desktop`: Electron shell that reuses the client build and server-backed SQLite collection store

## Features restored

- Global MobX store using modern decorators
- Small, focused UI components (simple `App` composition)
- Import/export of collection state
- ESLint + Prettier configured at the workspace root
- Turbo tasks for build/dev/lint/format

## Coding Guidelines

These apply to human contributors and Copilot alike:

- Avoid `interface` unless a class implements it. Prefer `type` aliases for plain shapes.
- Prefer keeping async orchestration in stores or other non-React layers.
- If a file has one main export, name the file after that export.
- Keep each file, class, or component focused on one responsibility.
- Name React component files so the UI role is obvious, for example `CollectionHeader.tsx` or `ImportExportDialog.tsx`.
- Keep esbuild configuration in a dedicated `esbuild.config.mjs` file. Do not inline esbuild flags in `package.json` scripts; the script should call the config file instead.

## Run

```bash
pnpm install
pnpm run build
pnpm run start
```

Server runs on `http://localhost:4173` by default.

SQLite defaults:

- Server-client (`pnpm run start`) uses `packages/server/panini.db`.
- Desktop (`pnpm run dev:desktop` / packaged app) uses a per-user SQLite file at `~/.ima-stickermanage/collection.db`.

Set `PANINI_DB` to override either default when needed.

## Development

```bash
pnpm run dev
```

Or run specific packages:

```bash
pnpm --filter @ima-stickermanage/client run dev
pnpm --filter @ima-stickermanage/server run dev
pnpm run dev:desktop
```

## Desktop app

The desktop app keeps the browser client intact for GitHub Pages. It loads the same built frontend and talks to the same SQLite-backed collection logic through Electron IPC instead of HTTP.

Before Electron starts or the desktop package is created, the native `better-sqlite3` module is rebuilt against Electron's ABI so the app can open the desktop database without version-mismatch errors.

Build the desktop shell locally:

```bash
pnpm install
pnpm run build:desktop
pnpm --filter @ima-stickermanage/desktop package
```

The server and desktop build scripts both call `esbuild.config.mjs` files so the build options stay discoverable and easy to maintain.

Publish desktop artifacts from GitHub with the `Build Desktop Release` workflow. The GitHub Pages deployment remains separate and still publishes `packages/client/dist/public`.

## Useful scripts

- `pnpm run build`
- `pnpm run dev`
- `pnpm run lint`
- `pnpm run lint:fix`
- `pnpm run format`
- `pnpm run format:check`
