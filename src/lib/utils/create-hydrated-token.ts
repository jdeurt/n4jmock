import type { HydratedLabel } from "../../structs/hydrated-label.js";
import type { LabelToken } from "../../structs/tokens/label.js";
import type { PropertyToken } from "../../structs/tokens/property.js";
import type { RelationshipToken } from "../../structs/tokens/relationship.js";

export const createHydratedLabel = (
    labelToken: LabelToken,
    inheritanceChain: string[],
    props: PropertyToken[],
    rels: RelationshipToken[]
): HydratedLabel => ({
    id: labelToken.id,
    inheritanceChain,
    abstract: labelToken.abstract,
    properties: [...labelToken.properties, ...props],
    relationships: [...labelToken.relationships, ...rels],
});
