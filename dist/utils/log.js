import { options } from "../globals.js";
export const log = (message) => {
    if (!options.verbose) {
        return;
    }
    console.log("[N4JM] " + message);
};
