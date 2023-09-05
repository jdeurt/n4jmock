import chalk from "chalk";
import type { Location } from "../../structs/tokens/token.js";
import { normalize } from "../../utils/normalize.js";
import { printSource } from "../../utils/print-source.js";

interface CompilationErrorOptions {
    cause?: Location | Location[];
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
            const causeArr = Array.isArray(options.cause)
                ? options.cause
                : [options.cause];

            super(normalize`
                ${chalk.red(message)}

                ${causeArr.map((cause) => printSource(cause)).join("\n\n")}

                ${chalk.blueBright(options.tip ?? "")}
            `);
        }
    }
}
