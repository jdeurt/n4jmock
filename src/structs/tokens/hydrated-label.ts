import type { IdToken } from "./id.js";
import type { PropertyToken } from "./property.js";
import type { RelationshipToken } from "./relationship.js";

export interface HydratedLabelToken {
    id: IdToken;
    abstract: boolean;
    properties: PropertyToken[];
    relationships: RelationshipToken[];
}
