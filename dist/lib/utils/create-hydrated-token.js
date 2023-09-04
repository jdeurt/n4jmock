export const createHydratedLabel = (labelToken, props, rels) => ({
    id: labelToken.id,
    isAbstract: labelToken.isAbstract,
    properties: [...labelToken.properties, ...props],
    relationships: [...labelToken.relationships, ...rels],
});
