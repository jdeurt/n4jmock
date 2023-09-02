import type { tokenSymbol } from "../../constants/symbols.js";
import type { Token, TokenKind } from "./token.js";

export interface ImportToken extends Token {
    [tokenSymbol]: TokenKind.IMPORT;

    path: string;
}
