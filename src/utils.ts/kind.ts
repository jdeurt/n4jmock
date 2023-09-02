import { tokenSymbol } from "../constants/symbols.js";
import type { AnyToken } from "../structs/tokens/any-token.js";
import type { TokenKind } from "../structs/tokens/token.js";

export const kind = (token: AnyToken) => token[tokenSymbol];

export const is = <K extends TokenKind>(
    token: AnyToken,
    tokenKind: K
): token is AnyToken & { [tokenSymbol]: K } => {
    return kind(token) === tokenKind;
};
