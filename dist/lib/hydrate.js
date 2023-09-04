import { log } from "../utils/log.js";
import { CompilationError } from "./errors/compilation-error.js";
import { createHydratedLabel } from "./utils/create-hydrated-token.js";
export const hydrate = (knownLabels, hydratedLabels) => {
    for (const label of knownLabels.values()) {
        hydrateLabel(label, knownLabels, hydratedLabels);
    }
};
const hydrateLabel = (label, knownLabels, hydratedLabels, seen = new Set()) => {
    if (hydratedLabels.has(label.id.name)) {
        return;
    }
    log(`Hydrating label ${label.id.name}`);
    if (seen.has(label.id.name)) {
        throw new CompilationError(`Circular reference detected: ${[...seen].join(" -> ")} -> ${label.id.name}`, {
            cause: label.location,
            tip: "Extending a label with itself is not allowed as labels cannot override their parents' properties or relationships.",
        });
    }
    seen.add(label.id.name);
    // Base case
    if (label.extending === undefined) {
        hydratedLabels.set(label.id.name, createHydratedLabel(label, [], []));
        return;
    }
    const parentLabelId = label.extending.id;
    const parentLabel = knownLabels.get(parentLabelId);
    if (parentLabel === undefined) {
        throw new CompilationError(`Unknown label: ${parentLabelId}`, {
            cause: label.extending.location,
        });
    }
    hydrateLabel(parentLabel, knownLabels, hydratedLabels, seen);
    const hydratedParent = hydratedLabels.get(parentLabelId);
    if (hydratedParent === undefined) {
        throw new CompilationError(`Inconsistent state: expected ${parentLabelId} to be hydrated. This should never happen.`);
    }
    const parentProperties = hydratedParent.properties;
    const parentRelationships = hydratedParent.relationships;
    for (const parentProp of parentProperties) {
        if (label.properties.some((prop) => prop.id === parentProp.id)) {
            throw new CompilationError(`Invalid property: ${label.id.name}.${parentProp.id}`, {
                tip: `The property ${parentProp.id} has already been defined in ${label.id.name}'s parent.`,
                cause: parentProp.location,
            });
        }
    }
    for (const parentRel of parentRelationships) {
        if (label.relationships.some((rel) => rel.id === parentRel.id)) {
            throw new CompilationError(`Invalid relationship: ${label.id.name}.${parentRel.id}`, {
                tip: `The relationship ${parentRel.id} has already been defined in ${label.id.name}'s parent.`,
                cause: parentRel.location,
            });
        }
    }
    const hydratedLabel = createHydratedLabel(label, parentProperties, parentRelationships);
    if (hydratedLabel.abstract && hydratedLabel.relationships.length > 0) {
        throw new CompilationError(`Unexpected relationship in abstract label: ${hydratedLabel.id.name}.${hydratedLabel.relationships[0].id}`, {
            tip: "Abstract labels cannot contain relationships since they are not included in the resulting query.",
            cause: hydratedLabel.relationships[0].location,
        });
    }
    log(`Hydrated: ${[...seen].join(" -> ")}`);
    hydratedLabels.set(hydratedLabel.id.name, hydratedLabel);
};
