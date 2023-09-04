import fs from "node:fs";
import path from "node:path";
import { panic } from "./utils/panic.js";
import { KnownType } from "./constants/known-type.js";
import { parse } from "./lib/parse.js";
import { hydrate } from "./lib/hydrate.js";
import { transpile } from "./lib/transpile.js";
import { CompilationError } from "./lib/errors/compilation-error.js";
import { options } from "./globals.js";
import chalk from "chalk";
const entrypoint = process.argv[2];
const flag = process.argv[3];
options.verbose = flag === "--verbose" || flag === "-v";
if (!entrypoint) {
    panic("No entrypoint specified.");
}
const entrypointPath = path.resolve(entrypoint);
if (!fs.existsSync(entrypointPath)) {
    panic(`Entrypoint "${entrypointPath}" does not exist.`);
}
export const knownLabels = new Map();
export const hydratedLabels = new Map();
export const knownTypes = new Map([
    ["string", KnownType.STRING],
    ["int", KnownType.INT],
    ["float", KnownType.FLOAT],
    ["bool", KnownType.BOOL],
]);
try {
    parse(entrypointPath, knownLabels, knownTypes);
    hydrate(knownLabels, hydratedLabels);
    const result = transpile(hydratedLabels, knownTypes);
    console.log(chalk.green(result));
}
catch (error) {
    if (error instanceof CompilationError) {
        panic(chalk.red(`[${error.name}] ${error.message}`));
    }
    throw error;
}
