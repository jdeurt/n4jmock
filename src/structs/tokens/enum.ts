import type { tokenSymbol } from "../../constants/symbols.js";
import type { DataToken } from "./data.js";
import type { IdToken } from "./id.js";
import type { Token, TokenKind } from "./token.js";

export interface EnumToken extends Token {
    [tokenSymbol]: TokenKind.ENUM;

    id: IdToken;
    members: DataToken[];
}
