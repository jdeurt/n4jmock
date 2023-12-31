import type { tokenSymbol } from "../../constants/symbols.js";
import type { DataToken } from "./data.js";
import type { Token, TokenKind } from "./token.js";

export interface TagToken extends Token {
    [tokenSymbol]: TokenKind.TAG;

    id: string;
    data: DataToken[];
}
