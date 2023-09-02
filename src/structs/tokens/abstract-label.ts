import type { tokenSymbol } from "../../constants/symbols.js";
import type { LabelRefToken } from "./label-ref.js";
import type { PropertyToken } from "./property.js";
import type { Token, TokenKind } from "./token.js";

export interface AbstractLabelToken extends Token {
    [tokenSymbol]: TokenKind.ABSTRACT_LABEL;

    id: string;
    properties: PropertyToken[];
    extending?: LabelRefToken;
}
