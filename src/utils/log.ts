import { options } from "../globals.js";

export const log = (message: string) => {
    if (!options.verbose) {
        return;
    }

    console.log("[N4JM] " + message);
};
