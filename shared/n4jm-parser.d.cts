import type { Result } from "../src/structs/result.js";

export function parse(
    code: string,
    options?: { grammarSource: string }
): Result;
