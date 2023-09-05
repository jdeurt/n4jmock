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
        hydratedLabels.set(label.id.name, createHydratedLabel(label));
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
    const hydratedLabel = createHydratedLabel(label, hydratedParent);
    log(`Hydrated: ${[...seen].join(" -> ")}`);
    hydratedLabels.set(hydratedLabel.id.name, hydratedLabel);
};
