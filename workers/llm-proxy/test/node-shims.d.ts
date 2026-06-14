// Minimal ambient declarations for the few Node built-ins used by the
// config-validation test. The Worker tsconfig only ships
// @cloudflare/workers-types (no @types/node), so `tsc --noEmit` (run in the
// deploy workflow) would otherwise fail to resolve `node:fs` / `process`.
// These are global (no imports/exports here), so they declare — rather than
// augment — the `node:fs` module.

declare module "node:fs" {
  export function readFileSync(path: string, encoding: string): string;
}

declare const process: { cwd(): string };
