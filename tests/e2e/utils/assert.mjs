/**
 * Shared assertion helper for E2E tests.
 * Logs PASS/FAIL with consistent formatting and sets process.exitCode = 1 on failure.
 */

export function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exitCode = 1;
    throw new Error(message);
  }
  console.log(`PASS: ${message}`);
}
