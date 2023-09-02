import type { tokenSymbol } from "../../constants/symbols.js";
import type { Token, TokenKind } from "./token.js";

export interface EnumToken extends Token {
    [tokenSymbol]: TokenKind.ENUM;

    id: string;
    members: string[];
}
