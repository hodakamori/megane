/**
 * Cloudflare Worker entry module for the LLM proxy.
 *
 * IMPORTANT: this file must export *only* a default ExportedHandler.
 * workerd treats every named export of the entry module as a named
 * entrypoint and requires it to be a function/handler, so all constants
 * and helpers (which the unit tests also import) live in ./proxy instead.
 */

import { handleFetch, type Env } from "./proxy";

export default {
  fetch(request: Request, env: Env): Promise<Response> {
    return handleFetch(request, env);
  },
};
