import type { HydratedLabelToken } from "../../structs/tokens/hydrated-label.js";
import type { LabelToken } from "../../structs/tokens/label.js";
import type { PropertyToken } from "../../structs/tokens/property.js";
import type { RelationshipToken } from "../../structs/tokens/relationship.js";

export const createHydratedLabel = (
    labelToken: LabelToken,
    props: PropertyToken[],
    rels: RelationshipToken[]
): HydratedLabelToken => ({
    id: labelToken.id,
    abstract: labelToken.abstract,
    properties: [...labelToken.properties, ...props],
    relationships: [...labelToken.relationships, ...rels],
});
