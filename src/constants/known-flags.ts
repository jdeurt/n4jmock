export const KnownFlags = {
    VERBOSE: ["verbose", "v", Boolean] as [string, string, BooleanConstructor],
    RELATIONSHIPS: ["relationships", "r", Number] as [
        string,
        string,
        NumberConstructor,
    ],
    PROPERTIES: ["properties", "p", Number] as [
        string,
        string,
        NumberConstructor,
    ],
    OUT: ["out", "o", String] as [string, string, StringConstructor],
};
