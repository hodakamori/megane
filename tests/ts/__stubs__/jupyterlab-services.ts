// Test-only stub for `@jupyterlab/services`. Only `Contents.IManager` is
// referenced (as a type), and TypeScript's `import type` erases it at runtime,
// so a namespace with the type alias is enough to satisfy import resolution.
// See sibling jupyterlab-coreutils.ts for the rationale.

export namespace Contents {
  export type IManager = unknown;
}
