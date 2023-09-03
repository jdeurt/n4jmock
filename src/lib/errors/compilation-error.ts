import { sourceCode } from "../../globals.js";
import { normalize } from "../../utils/normalize.js";

interface CompilationErrorOptions {
    cause?: { filePath: string; line: number; column: number };
    tip?: string;
}

export class CompilationError extends Error {
    constructor(message: string, options?: CompilationErrorOptions) {
        if (options === undefined) {
            super(message);
        } else if (options.cause === undefined) {
            super(normalize`
                ${message}

                ${options.tip ?? ""}
            `);
        } else {
            const { filePath, line, column } = options.cause;

            const problemCode = sourceCode.files[filePath].lines[line];

            super(normalize`
                ${message}

                ${filePath}:${line}:${column}
                ${line} | ${problemCode}
                ${" ".repeat(String(line).length + 3 + column)}^

                ${options.tip ?? ""}
            `);
        }
    }
}
