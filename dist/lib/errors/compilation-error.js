import { sourceCode } from "../../globals.js";
import { normalize } from "../../utils/normalize.js";
export class CompilationError extends Error {
    name = "CompilationError";
    constructor(message, options) {
        if (options === undefined) {
            super(message);
        }
        else if (options.cause === undefined) {
            super(normalize `
                ${message}

                ${options.tip ?? ""}
            `);
        }
        else {
            const { source, start } = options.cause;
            const problemCode = sourceCode.files[source].lines[start.line - 1];
            super(normalize `
                ${message}

                ${source}:${start.line}:${start.column}
                ${start.line} | ${problemCode}
                ${" ".repeat(String(start.line).length + 2 + start.column)}^
                ${options.tip ?? ""}
            `);
        }
    }
}
