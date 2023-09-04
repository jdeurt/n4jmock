export const getFlag = <T extends BooleanConstructor | NumberConstructor>(
    args: string[],
    [long, short, constructor]: [string, string, T]
): ReturnType<T> | undefined => {
    for (const arg of args) {
        if (arg.startsWith(`--${long}`) || arg.startsWith(`-${short}`)) {
            if (constructor === Boolean) {
                return true as ReturnType<T>;
            } else if (constructor === Number) {
                return Number(arg.split("=")[1]) as ReturnType<T>;
            }
        }
    }
};
