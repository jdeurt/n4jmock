import type { tokenSymbol } from "../../constants/symbols.js";
import type { LabelRefToken } from "./label-ref.js";
import type { PropertyToken } from "./property.js";
import type { RelationshipToken } from "./relationship.js";
import type { Token, TokenKind } from "./token.js";

export interface LabelToken extends Token {
    [tokenSymbol]: TokenKind.LABEL;

    id: string;
    properties: PropertyToken[];
    relationships: RelationshipToken[];
    extending?: LabelRefToken;
}
