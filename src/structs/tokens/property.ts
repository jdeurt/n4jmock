import type { tokenSymbol } from "../../constants/symbols.js";
import type { TagToken } from "./tag.js";
import type { Token, TokenKind } from "./token.js";
import type { TypeRefToken } from "./type-ref.js";

export interface PropertyToken extends Token {
    [tokenSymbol]: TokenKind.PROPERTY;

    id: string;
    ref: TypeRefToken;
    tags: TagToken[];
}
