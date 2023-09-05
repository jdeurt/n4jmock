export const getFlag = <
    T extends BooleanConstructor | NumberConstructor | StringConstructor,
>(
    args: string[],
    [long, short, constructor]: [string, string, T]
): ReturnType<T> | undefined => {
    for (const arg of args) {
        if (arg.startsWith(`--${long}`) || arg.startsWith(`-${short}`)) {
            switch (constructor) {
                case Boolean: {
                    return true as ReturnType<T>;
                }
                case Number: {
                    return Number(arg.split("=")[1]) as ReturnType<T>;
                }
                case String: {
                    return String(arg.split("=")[1]) as ReturnType<T>;
                }
                // No default
            }
        }
    }
};
