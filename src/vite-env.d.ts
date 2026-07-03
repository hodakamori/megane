/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL of the Cloudflare Worker that proxies free-tier demo chat requests. */
  readonly VITE_LLM_PROXY_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Vite worker imports
declare module "*?worker" {
  const WorkerFactory: new () => Worker;
  export default WorkerFactory;
}

// Vite inlined worker imports (base64 blob worker; required for single-file
// bundles and the VSCode webview CSP which only allows `worker-src blob:`).
declare module "*?worker&inline" {
  const WorkerFactory: new () => Worker;
  export default WorkerFactory;
}
