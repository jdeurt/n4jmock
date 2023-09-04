export const normalize = (strings, ...expressions) => {
    const raw = strings.reduce((acc, str, i) => acc + str + `%e`, "");
    let normalized = "";
    let offset;
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
