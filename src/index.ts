import fs from "node:fs";
import path from "node:path";
import { panic } from "./utils/panic.js";
import type { LabelToken } from "./structs/tokens/label.js";
import type { AbstractLabelToken } from "./structs/tokens/abstract-label.js";
import type { EnumToken } from "./structs/tokens/enum.js";
import { KnownType } from "./constants/known-type.js";
import type {
    HydratedAbstractLabelToken,
    HydratedLabelToken,
} from "./structs/tokens/hydrated-label.js";
import { parse } from "./lib/parse.js";
import { hydrate } from "./lib/hydrate.js";
import { transpile } from "./lib/transpile.js";
import { CompilationError } from "./lib/errors/compilation-error.js";

const entrypoint = process.argv[2];

if (!entrypoint) {
    panic("No entrypoint specified.");
}

const entrypointPath = path.resolve(entrypoint);

if (!fs.existsSync(entrypointPath)) {
    panic(`Entrypoint "${entrypointPath}" does not exist.`);
}

export const knownLabels = new Map<string, LabelToken | AbstractLabelToken>();

export const hydratedLabels = new Map<
    string,
    HydratedLabelToken | HydratedAbstractLabelToken
>();

export const knownTypes = new Map<string, EnumToken | KnownType>([
    ["string", KnownType.STRING],
    ["int", KnownType.INT],
    ["float", KnownType.FLOAT],
    ["bool", KnownType.BOOL],
]);

try {
    parse(entrypointPath, knownLabels, knownTypes);

    hydrate(knownLabels, hydratedLabels);

    const result = transpile(hydratedLabels, knownTypes);

    console.log(result);
} catch (error) {
    if (error instanceof CompilationError) {
        panic(error.message);
    }

    throw error;
}
