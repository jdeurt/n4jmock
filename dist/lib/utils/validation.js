import { CompilationError } from "../errors/compilation-error.js";
export const validateModifiers = (label, parent) => {
    if (label.abstract && label.relationships.length > 0) {
        throw new CompilationError(`Unexpected relationship in abstract label: ${label.id.name}.${label.relationships[0].id}`, {
            tip: "Abstract labels cannot contain relationships since they are not included in the resulting query.",
            cause: label.relationships[0].location,
        });
    }
    if (label.abstract && parent?.abstract === true) {
        throw new CompilationError(`Invalid parent: ${label.id.name} -> ${parent.id.name}`, {
            tip: "An abstract label may not inherit from a concrete one.",
            cause: label.extending?.location,
        });
    }
};
export const validateProperties = (label, parent) => {
    for (const parentProp of parent.properties) {
        for (const prop of label.properties) {
            if (prop.id === parentProp.id) {
                throw new CompilationError(`Invalid property: ${label.id.name}.${prop.id}`, {
                    tip: `The property ${prop.id} has already been defined in ${label.id.name}'s parent.`,
                    cause: prop.location,
                });
            }
        }
    }
};
export const validateRelationships = (label, parent) => {
    for (const parentRel of parent.relationships) {
        for (const rel of label.relationships) {
            if (rel.id === parentRel.id) {
                throw new CompilationError(`Invalid relationship: ${label.id.name}.${rel.id}`, {
                    tip: `The relationship ${rel.id} has already been defined in ${label.id.name}'s parent.`,
                    cause: rel.location,
                });
            }
        }
    }
};
