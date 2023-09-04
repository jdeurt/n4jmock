export const createHydratedLabel = (labelToken, props, rels) => ({
    id: labelToken.id,
    abstract: labelToken.abstract,
    properties: [...labelToken.properties, ...props],
    relationships: [...labelToken.relationships, ...rels],
});
