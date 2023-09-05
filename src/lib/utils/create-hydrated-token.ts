import type { HydratedLabel } from "../../structs/hydrated-label.js";
import type { LabelToken } from "../../structs/tokens/label.js";
import {
    validateModifiers,
    validateProperties,
    validateRelationships,
} from "./validation.js";

export const createHydratedLabel = (
    labelToken: LabelToken,
    parent?: HydratedLabel
): HydratedLabel => {
    validateModifiers(labelToken, parent);

    if (parent !== undefined) {
        validateProperties(labelToken, parent);
        validateRelationships(labelToken, parent);
    }

    return {
        id: labelToken.id,
        inheritanceChain: parent?.abstract
            ? []
            : [labelToken.id.name, ...(parent?.inheritanceChain ?? [])],
        abstract: labelToken.abstract,
        properties: [...labelToken.properties, ...(parent?.properties ?? [])],
        relationships: [
            ...labelToken.relationships,
            ...(parent?.relationships ?? []),
        ],
    };
};
