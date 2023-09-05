import fs from "node:fs";
import path from "node:path";
import { panic } from "./utils/panic.js";
import { KnownType } from "./constants/known-type.js";
import { parse } from "./lib/parse.js";
import { hydrate } from "./lib/hydrate.js";
import { transpile } from "./lib/transpile.js";
import { CompilationError } from "./lib/errors/compilation-error.js";
import { options } from "./globals.js";
export const n4jm = (entrypoint) => {
    const entrypointPath = path.resolve(entrypoint);
    if (!fs.existsSync(entrypointPath)) {
        panic(`Entrypoint "${entrypointPath}" does not exist.`);
    }
    const knownLabels = new Map();
    const hydratedLabels = new Map();
    const knownTypes = new Map([
        ["string", KnownType.STRING],
        ["int", KnownType.INT],
        ["float", KnownType.FLOAT],
        ["bool", KnownType.BOOL],
    ]);
    try {
        parse(entrypointPath, knownLabels, knownTypes);
        hydrate(knownLabels, hydratedLabels);
        const result = transpile(hydratedLabels, knownTypes);
        if (options.noFile) {
            console.log(result);
            return;
        }
        const outPath = path.resolve(options.out);
        fs.writeFileSync(outPath, result, "utf8");
        console.log(`Query saved to ${outPath}`);
    }
    catch (error) {
        if (error instanceof CompilationError) {
            panic(error.message);
        }
        throw error;
    }
};
