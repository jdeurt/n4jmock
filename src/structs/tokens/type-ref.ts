import type { tokenSymbol } from "../../constants/symbols.js";
import type { Token, TokenKind } from "./token.js";

export interface TypeRefToken extends Token {
    [tokenSymbol]: TokenKind.TYPE_REF;

    id: string;
    isList: boolean;
}
