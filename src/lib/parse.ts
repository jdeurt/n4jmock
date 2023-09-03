import path from "node:path";
import type { KnownType } from "../constants/known-type.js";
import type { AbstractLabelToken } from "../structs/tokens/abstract-label.js";
import type { EnumToken } from "../structs/tokens/enum.js";
import type { LabelToken } from "../structs/tokens/label.js";
import * as parser from "../../shared/n4jm-parser.cjs";
import { existsSync, readFileSync } from "node:fs";
import { CompilationError } from "./errors/compilation-error.js";
import { tokenSymbol } from "../constants/symbols.js";
import { TokenKind } from "../structs/tokens/token.js";

export const parse = (
    entrypoint: string,
    knownLabels: Map<string, AbstractLabelToken | LabelToken>,
    knownTypes: Map<string, EnumToken | KnownType>
    // eslint-disable-next-line sonarjs/cognitive-complexity
) => {
    const baseDir = path.dirname(entrypoint);

    const seen = new Set(entrypoint);

    const scanQueue = [entrypoint];

    while (scanQueue.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const module = scanQueue.shift()!;

        if (seen.has(module)) {
            continue;
        }

        seen.add(module);

        const { imports, declarations } = parser.parse(
            readFileSync(module, "utf8")
        );

        if (imports) {
            for (const { path: importPath } of imports) {
                const resolvedImportPath =
                    path.resolve(baseDir, importPath) + ".n4jm";

                if (!existsSync(resolvedImportPath)) {
                    throw new CompilationError(
                        `Module '${resolvedImportPath}' not found.`,
                        {
                            tip:
                                "Modules are resolved relative to the entry point's directory. " +
                                "For example, if your entry point is 'foo/bar/main.n4jm' then an import 'baz' would be resolved as 'foo/bar/baz.n4jm'.",
                        }
                    );
                }

                scanQueue.push(resolvedImportPath);
            }
        }

        for (const declaration of declarations) {
            switch (declaration[tokenSymbol]) {
                case TokenKind.ABSTRACT_LABEL:
                case TokenKind.LABEL: {
                    if (knownLabels.has(declaration.id)) {
                        throw new CompilationError(
                            `Duplicate label definition: ${declaration.id}.`
                        );
                    }

                    knownLabels.set(declaration.id, declaration);

                    break;
                }
                case TokenKind.ENUM: {
                    if (knownTypes.has(declaration.id)) {
                        throw new CompilationError(
                            `Duplicate enum definition: ${declaration.id}.`
                        );
                    }

                    knownTypes.set(declaration.id, declaration);
                }
            }
        }
    }
};
