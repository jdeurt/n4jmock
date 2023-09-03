export const normalize = (
    strings: TemplateStringsArray,
    ...expressions: unknown[]
) => {
    const raw = strings.reduce(
        (acc, str, i) => acc + str + String(expressions[i] ?? ""),
        ""
    );

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

    return normalized.trimEnd();
};
