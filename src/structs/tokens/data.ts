import type { tokenSymbol } from "../../constants/symbols.js";
import type { Token, TokenKind } from "./token.js";

export interface DataToken extends Token {
    [tokenSymbol]: TokenKind.DATA;

    content: string;
}
