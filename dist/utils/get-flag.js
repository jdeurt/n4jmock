export const getFlag = (args, [long, short, constructor]) => {
    for (const arg of args) {
        if (arg.startsWith(`--${long}`) || arg.startsWith(`-${short}`)) {
            switch (constructor) {
                case Boolean: {
                    return true;
                }
                case Number: {
                    return Number(arg.split("=")[1]);
                }
                case String: {
                    return String(arg.split("=")[1]);
                }
                // No default
            }
        }
    }
};
