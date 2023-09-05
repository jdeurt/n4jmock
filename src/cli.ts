#!/usr/bin/env node

import yargs from "yargs";
import { options } from "./globals.js";
import { n4jm } from "./n4jm.js";

const args = await yargs(process.argv.slice(2))
    .scriptName("n4jm")
    .usage("$0 <path> [options]")
    .example("$0 ./mock -o query.cypher", "")
    .demand(1)
    .positional("path", {
        type: "string",
        describe: "The path to the directory which contains your n4jm files",
    })
    .boolean("verbose")
    .alias("verbose", ["v"])
    .describe("verbose", "Print debug messages to console")
    .number("nodes")
    .alias("nodes", ["n"])
    .describe(
        "nodes",
        "The amount of unique nodes to generate for each label (Foo {})"
    )
    .number("relationships")
    .alias("relationships", ["r"])
    .describe(
        "relationships",
        "The number of connections to generate for each relationship field (foo -> bar)"
    )
    .string("out")
    .alias("out", ["o"])
    .describe("out", "The location the resulting query should be written to")
    .boolean("nofile")
    .describe(
        "nofile",
        "Do not generate an output file and instead write the result to stdout"
    )
    .help().argv;

if (!args._[0]) {
    throw new Error(
        "Entry point not provided. This should've been already handled yet here we are."
    );
}

options.nodes = args.nodes ?? 1;
options.out = args.out ?? "query.cypher";
options.relationships = args.relationships ?? 1;
options.verbose = args.verbose ?? false;
options.noFile = args.nofile ?? false;

n4jm(String(args._[0]));
