export const normalize = (
    strings: TemplateStringsArray,
    ...expressions: unknown[]
) => {
    const raw = strings.reduce((acc, str, i) => acc + str + `%e`, "");

    let normalized = "";
    let offset: number | undefined;

    for (const line of raw.split("\n")) {
        const trimmed = line.trimStart();

        if (offset === undefined) {
            if (trimmed.length === 0) {
                continue;
            }

            offset = line.length - trimmed.length;
        }

        normalized += line.slice(offset) + "\n";
    }

    for (const expr of expressions) {
        normalized = normalized.replace("%e", String(expr ?? ""));
    }

    return normalized.trimEnd();
};
