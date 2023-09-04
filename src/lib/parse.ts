import path from "node:path";
import type { KnownType } from "../constants/known-type.js";
import type { EnumToken } from "../structs/tokens/enum.js";
import type { LabelToken } from "../structs/tokens/label.js";
import * as parser from "../../shared/n4jm-parser.cjs";
import { readFileSync } from "node:fs";
import { CompilationError } from "./errors/compilation-error.js";
import { tokenSymbol } from "../constants/symbols.js";
import { TokenKind } from "../structs/tokens/token.js";
import { globIterateSync } from "glob";
import { log } from "../utils/log.js";
import { sourceCode } from "../globals.js";

export const parse = (
    entrypoint: string,
    knownLabels: Map<string, LabelToken>,
    knownTypes: Map<string, EnumToken | KnownType>
) => {
    const baseDir = path.dirname(entrypoint);

    log(`Parsing N4JM schema definitions in ${baseDir}`);

    for (const modulePath of globIterateSync(`${baseDir}/**/*.n4jm`)) {
        log(`Parsing module: ${modulePath}`);

        const content = readFileSync(modulePath, "utf8");

        sourceCode.files[modulePath] = content;

        const { declarations } = parser.parse(content, {
            grammarSource: modulePath,
        });

        for (const declaration of declarations) {
            switch (declaration[tokenSymbol]) {
                case TokenKind.LABEL: {
                    if (knownLabels.has(declaration.id.name)) {
                        throw new CompilationError(
                            `Duplicate label definition: ${declaration.id.name}.`,
                            { cause: declaration.id.location }
                        );
                    }

                    log(`Found label declaration: ${declaration.id.name}`);

                    knownLabels.set(declaration.id.name, declaration);

                    break;
                }
                case TokenKind.ENUM: {
                    if (knownTypes.has(declaration.id.name)) {
                        throw new CompilationError(
                            `Duplicate enum definition: ${declaration.id.name}.`,
                            { cause: declaration.id.location }
                        );
                    }

                    log(`Found enum declaration: ${declaration.id.name}`);

                    knownTypes.set(declaration.id.name, declaration);
                }
            }
        }
    }
};
