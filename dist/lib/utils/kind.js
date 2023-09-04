import { tokenSymbol } from "../../constants/symbols.js";
export const kind = (token) => token[tokenSymbol];
export const is = (token, tokenKind) => {
    return kind(token) === tokenKind;
};
