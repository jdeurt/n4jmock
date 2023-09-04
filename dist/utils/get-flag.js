export const getFlag = (args, [long, short, constructor]) => {
    for (const arg of args) {
        if (arg.startsWith(`--${long}`) || arg.startsWith(`-${short}`)) {
            if (constructor === Boolean) {
                return true;
            }
            else if (constructor === Number) {
                return Number(arg.split("=")[1]);
            }
        }
    }
};
