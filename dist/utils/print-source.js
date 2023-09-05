import chalk from "chalk";
import { sourceCode } from "../globals.js";
import { normalize } from "./normalize.js";
export const printSource = ({ source, start, end }) => {
    const maxLineNumLen = String(end.line).length;
    const lines = sourceCode.files[source].split("\n");
    let highlightedSourceCode = "";
    for (let i = start.line; i <= end.line; i++) {
        const line = lines[i - 1];
        const preError = line.slice(0, i === start.line ? start.column - 1 : 0);
        const errorPart = line.slice(i === start.line ? start.column - 1 : 0, i === end.line ? end.column - 1 : line.length);
        const postError = line.slice(i === end.line ? end.column - 1 : line.length);
        highlightedSourceCode += preError + chalk.red(errorPart) + postError;
    }
    highlightedSourceCode = highlightedSourceCode
        .split("\n")
        .map((line, i) => `${String(start.line + i).padStart(maxLineNumLen)} | ${line}`)
        .join("\n");
    return normalize `
        ${source}:${start.line}:${start.column}
        ${highlightedSourceCode}
    `;
};
