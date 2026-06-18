# Copilot Instructions

Follow these project-specific coding practices:

- Avoid `interface` unless it is implemented by a class. Prefer `type` aliases for plain object shapes.
- Prefer keeping async work and orchestration in stores or other non-React layers. React components should stay mostly synchronous and focused on rendering.
- If a file has one main export, name the file after that export, including capital letters when appropriate.
- Keep responsibilities narrow. Do not put unrelated logic, data shaping, state management, and UI rendering in the same file, class, or component.
- Give React component files names that clearly imply UI concerns. Good examples: `CollectionHeader.tsx`, `StickerGrid.tsx`. Avoid vague names like `ImportExport.tsx`; prefer names that read like a UI component, such as `ImportExportDialog.tsx` or `CollectionImportExport.tsx`.
