import fs from "node:fs";
import path from "node:path";
import { panic } from "./utils.ts/panic.js";
import * as parser from "../shared/n4jm-parser.cjs";
import type { LabelToken } from "./structs/tokens/label.js";
import type { AbstractLabelToken } from "./structs/tokens/abstract-label.js";
import type { EnumToken } from "./structs/tokens/enum.js";
import { KnownType } from "./constants/known-type.js";
import { tokenSymbol } from "./constants/symbols.js";
import { TokenKind } from "./structs/tokens/token.js";
import { applyInheritance } from "./utils.ts/apply-inheritance.js";
import { mockType } from "./utils.ts/mock-type.js";
import { Direction } from "./structs/tokens/relationship.js";

const entrypoint = process.argv[2];

if (!entrypoint) {
    panic("No entrypoint specified.");
}

const entrypointPath = path.resolve(entrypoint);

if (!fs.existsSync(entrypointPath)) {
    panic(`Entrypoint "${entrypointPath}" does not exist.`);
}

const baseDir = path.dirname(entrypointPath);

const scanQueue: string[] = [entrypointPath];

const knownLabels = new Map<string, LabelToken | AbstractLabelToken>();
const knownTypes = new Map<string, EnumToken | KnownType>([
    ["string", KnownType.STRING],
    ["int", KnownType.INT],
    ["float", KnownType.FLOAT],
    ["bool", KnownType.BOOL],
]);

while (scanQueue.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const module = scanQueue.shift()!;

    const { imports, declarations } = parser.parse(
        fs.readFileSync(module, "utf8")
    );

    if (imports) {
        for (const { path: importPath } of imports) {
            const resolvedImportPath =
                path.resolve(baseDir, importPath) + ".n4jm";

            if (!fs.existsSync(resolvedImportPath)) {
                panic(`Module "${resolvedImportPath}" does not exist.`);
            }

            scanQueue.push(resolvedImportPath);
        }
    }

    for (const declaration of declarations) {
        switch (declaration[tokenSymbol]) {
            case TokenKind.ABSTRACT_LABEL:
            case TokenKind.LABEL: {
                if (knownLabels.has(declaration.id)) {
                    panic(`Duplicate label identifier: ${declaration.id}.`);
                }

                knownLabels.set(declaration.id, declaration);

                break;
            }
            case TokenKind.ENUM: {
                if (knownTypes.has(declaration.id)) {
                    panic(`Duplicate enum identifier ${declaration.id}.`);
                }

                knownTypes.set(declaration.id, declaration);
            }
        }
    }
}

const knownHydratedLabels = new Map<string, LabelToken | AbstractLabelToken>();

for (const declaration of knownLabels.values()) {
    applyInheritance(declaration, knownLabels, knownHydratedLabels);
}

let n4jQuery = "";

for (const declaration of knownLabels.values()) {
    if (declaration[tokenSymbol] === TokenKind.ABSTRACT_LABEL) {
        continue;
    }

    n4jQuery += `CREATE (a:${declaration.id})\n`;

    for (const property of declaration.properties) {
        const type = knownTypes.get(property.ref.id);

        if (type === undefined) {
            panic(`Unknown type: ${property.ref.id}.`);

            break;
        }

        const mockedValue = mockType(type, property);

        n4jQuery += `SET a.${property.id} = ${
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            typeof mockedValue === "string" ? `'${mockedValue}'` : mockedValue
        }\n`;
    }
}

for (const declaration of knownLabels.values()) {
    if (declaration[tokenSymbol] === TokenKind.ABSTRACT_LABEL) {
        continue;
    }

    for (const relationship of declaration.relationships) {
        for (const ref of relationship.refs) {
            const refLabel = knownLabels.get(ref.id);

            if (!refLabel) {
                panic(`Unknown label: ${ref.id}.`);

                break;
            }

            n4jQuery += `MATCH (a:${declaration.id}), (b:${ref.id})\n`;

            switch (relationship.direction) {
                case Direction.OUT: {
                    n4jQuery += `CREATE (a)-[:${relationship.id}]->(b)\n`;

                    break;
                }
                case Direction.IN: {
                    n4jQuery += `CREATE (a)<-[:${relationship.id}]-(b)\n`;

                    break;
                }
                case Direction.BOTH: {
                    n4jQuery += `CREATE (a)-[:${relationship.id}]->(b)\n`;
                    n4jQuery += `CREATE (a)<-[:${relationship.id}]-(b)\n`;

                    break;
                }
                case Direction.UNDIRECTED: {
                    n4jQuery += `CREATE (a)-[:${relationship.id}]-(b)\n`;

                    break;
                }
            }
        }
    }
}

console.log(n4jQuery);
