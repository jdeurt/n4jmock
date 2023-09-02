import type { AbstractLabelToken } from "./abstract-label.js";
import type { EnumToken } from "./enum.js";
import type { ImportToken } from "./import.js";
import type { LabelRefToken } from "./label-ref.js";
import type { LabelToken } from "./label.js";
import type { PropertyToken } from "./property.js";
import type { RelationshipToken } from "./relationship.js";
import type { TagToken } from "./tag.js";
import type { TypeRefToken } from "./type-ref.js";

export type AnyToken =
    | AbstractLabelToken
    | EnumToken
    | ImportToken
    | LabelToken
    | LabelRefToken
    | PropertyToken
    | RelationshipToken
    | TagToken
    | TypeRefToken;
