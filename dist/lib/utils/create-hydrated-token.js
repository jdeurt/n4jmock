import { validateModifiers, validateProperties, validateRelationships, } from "./validation.js";
export const createHydratedLabel = (labelToken, parent) => {
    validateModifiers(labelToken, parent);
    if (parent !== undefined) {
        validateProperties(labelToken, parent);
        validateRelationships(labelToken, parent);
    }
    return {
        id: labelToken.id,
        inheritanceChain: [
            labelToken.id.name,
            ...(parent?.inheritanceChain ?? []),
        ],
        abstract: labelToken.abstract,
        properties: [...labelToken.properties, ...(parent?.properties ?? [])],
        relationships: [
            ...labelToken.relationships,
            ...(parent?.relationships ?? []),
        ],
    };
};
