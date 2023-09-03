import type { tokenSymbol } from "../../constants/symbols.js";
import type { PropertyToken } from "./property.js";
import type { RelationshipToken } from "./relationship.js";
import type { Token, TokenKind } from "./token.js";

export interface HydratedAbstractLabelToken extends Token {
    [tokenSymbol]: TokenKind.ABSTRACT_LABEL;

    id: string;
    properties: PropertyToken[];
}

export interface HydratedLabelToken extends Token {
    [tokenSymbol]: TokenKind.LABEL;

    id: string;
    properties: PropertyToken[];
    relationships: RelationshipToken[];
}
