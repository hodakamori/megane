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
