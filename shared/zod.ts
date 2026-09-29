import { z } from "zod";

/**
 * zod 4 probes for `eval` (a `new Function("")` in a try/catch) to JIT-compile object
 * schemas. The production CSP forbids eval, so on every page with a form the browser logs
 * a CSP issue, which Lighthouse marks down. `jitless` skips the probe; the interpreted
 * path is plenty fast for these forms. The schemas import `z` from here so the setting is
 * applied before any of them is built.
 */
z.config({ jitless: true });

export { z };
