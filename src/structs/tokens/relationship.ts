import type { tokenSymbol } from "../../constants/symbols.js";
import type { LabelRefToken } from "./label-ref.js";
import type { TagToken } from "./tag.js";
import type { Token, TokenKind } from "./token.js";

export enum Direction {
    OUT = "->",
    IN = "<-",
    BOTH = "<>",
    UNDIRECTED = "--",
}

export interface RelationshipToken extends Token {
    [tokenSymbol]: TokenKind.RELATIONSHIP;

    id: string;
    direction: Direction;
    refs: LabelRefToken[];
    tags: TagToken[];
}
