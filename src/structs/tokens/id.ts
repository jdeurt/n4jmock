import type { tokenSymbol } from "../../constants/symbols.js";
import type { Token, TokenKind } from "./token.js";

export interface IdToken extends Token {
    [tokenSymbol]: TokenKind.ID;

    name: string;
}
