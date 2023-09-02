import type { tokenSymbol } from "../../constants/symbols.js";

export enum TokenKind {
    ABSTRACT_LABEL = "abstract-label",
    ENUM = "enum",
    IMPORT = "import",
    PROPERTY = "property",
    LABEL = "label",
    RELATIONSHIP = "relationship",
    TAG = "tag",
    LABEL_REF = "label-ref",
    TYPE_REF = "type-ref",
}

export interface Token {
    [tokenSymbol]: TokenKind;
}
