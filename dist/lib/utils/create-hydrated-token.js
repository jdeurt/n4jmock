export const createHydratedLabel = (labelToken, inheritanceChain, props, rels) => ({
    id: labelToken.id,
    inheritanceChain,
    abstract: labelToken.abstract,
    properties: [...labelToken.properties, ...props],
    relationships: [...labelToken.relationships, ...rels],
});
