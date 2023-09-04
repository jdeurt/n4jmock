import type { tokenSymbol } from "../../constants/symbols.js";

export enum TokenKind {
    TAG = "tag",
    LABEL = "label",
    PROPERTY = "property",
    RELATIONSHIP = "relationship",
    ENUM = "enum",
    LABEL_REF = "label-ref",
    TYPE_REF = "type-ref",
    DATA = "data",
    ID = "id",
}

export interface Location {
    source: string;
    start: {
        line: number;
        column: number;
    };
    end: {
        line: number;
        column: number;
    };
}

export interface Token {
    [tokenSymbol]: TokenKind;
    location: Location;
}
