import type { tokenSymbol } from "../../constants/symbols.js";
import type { Token, TokenKind } from "./token.js";

export interface LabelRefToken extends Token {
    [tokenSymbol]: TokenKind.LABEL_REF;

    id: string;
}
