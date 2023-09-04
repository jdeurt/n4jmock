import type { IdToken } from "./tokens/id.js";
import type { PropertyToken } from "./tokens/property.js";
import type { RelationshipToken } from "./tokens/relationship.js";

export interface HydratedLabel {
    id: IdToken;
    inheritanceChain: string[];
    abstract: boolean;
    properties: PropertyToken[];
    relationships: RelationshipToken[];
}
