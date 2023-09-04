import chalk from "chalk";
import { sourceCode } from "../../globals.js";
import type { Location } from "../../structs/tokens/token.js";
import { normalize } from "../../utils/normalize.js";

interface CompilationErrorOptions {
    cause?: Location;
    tip?: string;
}

export class CompilationError extends Error {
    // eslint-disable-next-line sonarjs/cognitive-complexity
    constructor(message: string, options?: CompilationErrorOptions) {
        if (options === undefined) {
            super(message);
        } else if (options.cause === undefined) {
            super(normalize`
                ${message}

                ${options.tip ?? ""}
            `);
        } else {
            const { source, start, end } = options.cause;

            const maxLineNumLen = String(end.line).length;

            const lines = sourceCode.files[source].split("\n");

            let highlightedSourceCode = "";

            for (let i = start.line; i <= end.line; i++) {
                const line = lines[i - 1];

                const preError = line.slice(
                    0,
                    i === start.line ? start.column - 1 : 0
                );

                const errorPart = line.slice(
                    i === start.line ? start.column - 1 : 0,
                    i === end.line ? end.column - 1 : line.length
                );

                const postError = line.slice(
                    i === end.line ? end.column - 1 : line.length
                );

                highlightedSourceCode +=
                    preError + chalk.red(errorPart) + postError;
            }

            highlightedSourceCode = highlightedSourceCode
                .split("\n")
                .map(
                    (line, i) =>
                        `${String(start.line + i).padStart(
                            maxLineNumLen
                        )} | ${line}`
                )
                .join("\n");

            super(normalize`
                ${chalk.red(message)}

                ${source}:${start.line}:${start.column}
                ${highlightedSourceCode}

                ${chalk.blueBright(options.tip ?? "")}
            `);
        }
    }
}
