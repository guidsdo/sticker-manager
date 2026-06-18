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

## Run

```bash
pnpm install
pnpm run build
pnpm run start
```

Server runs on `http://localhost:4173` by default.

## Development

```bash
pnpm run dev
```

Or run specific packages:

```bash
pnpm --filter @ima-stickermanage/client run dev
pnpm --filter @ima-stickermanage/server run dev
```

## Useful scripts

- `pnpm run build`
- `pnpm run dev`
- `pnpm run lint`
- `pnpm run lint:fix`
- `pnpm run format`
- `pnpm run format:check`
