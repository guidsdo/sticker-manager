# Panini FIFA World Cup 2026 Monorepo Sticker Manager

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
