/**
 * Benchmark orchestration: run every case through a generate function and
 * score the responses. The generate function is injected so this module is
 * fully testable without the network — the live runner passes
 * `generatePipelineLive`, tests pass a stub.
 */

import { scoreResponse } from "./scorer";
import type { CaseRecord } from "./report";
import type { BenchCase } from "./types";

/** Produce a model response for one prompt. */
export type GenerateFn = (prompt: string) => Promise<string>;

export interface RunOptions {
  /** Called after each case completes (for progress logging). */
  onResult?: (record: CaseRecord, index: number, total: number) => void;
}

/**
 * Run every case through `generate`, scoring each response. A generation error
 * is captured per case (scored as an empty response → total 0) so one failure
 * never aborts the whole run.
 */
export async function runDataset(
  cases: BenchCase[],
  generate: GenerateFn,
  options: RunOptions = {},
): Promise<CaseRecord[]> {
  const records: CaseRecord[] = [];
  for (let i = 0; i < cases.length; i++) {
    const c = cases[i];
    const start = Date.now();
    let response = "";
    let error: string | undefined;
    try {
      response = await generate(c.prompt);
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }
    const record: CaseRecord = {
      case: c,
      response,
      score: scoreResponse(response, c.rubric),
      latencyMs: Date.now() - start,
      error,
    };
    records.push(record);
    options.onResult?.(record, i, cases.length);
  }
  return records;
}
