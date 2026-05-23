# stevie-playground — agent contributor guide

A small TypeScript library of formatting utilities used as a smoke fixture for the Stevie agent framework. Each module
exports format + parse functions.

## Stack

- TypeScript (strict, ES2022, NodeNext modules)
- vitest for tests
- pnpm 10

## Commands

- `pnpm install` — install dev dependencies
- `pnpm test` — run vitest
- `pnpm lint` — `tsc --noEmit`

## Conventions

- **No new runtime dependencies.** Use built-in APIs (`Intl`, etc.) only.
- **Preserve existing test behavior** when extending APIs. New optional parameters must not change defaults.
- **One module per domain.** Co-locate `*.test.ts` next to the source.
- **Named exports only**, no defaults.
- **`import type`** for type-only imports.
- **PR descriptions** summarise the public-API contract change with one usage example per public function touched.
- **No agent activity log.** Do not add or extend a "Completed Agent Work Items" section to README — this was an old
  experiment and is dropped.
