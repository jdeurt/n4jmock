import type { AbstractLabelToken } from "../structs/tokens/abstract-label.js";
import type {
    HydratedAbstractLabelToken,
    HydratedLabelToken,
} from "../structs/tokens/hydrated-label.js";
import type { LabelToken } from "../structs/tokens/label.js";
import { TokenKind } from "../structs/tokens/token.js";
import { is } from "./utils/kind.js";
import { CompilationError } from "./errors/compilation-error.js";
import {
    createHydratedAbstractLabel,
    createHydratedLabel,
} from "./utils/create-hydrated-token.js";

export const hydrate = (
    knownLabels: Map<string, LabelToken | AbstractLabelToken>,
    hydratedLabels: Map<string, HydratedLabelToken | HydratedAbstractLabelToken>
) => {
    for (const label of knownLabels.values()) {
        hydrateLabel(label, knownLabels, hydratedLabels);
    }
};

const hydrateLabel = (
    label: LabelToken | AbstractLabelToken,
    knownLabels: Map<string, LabelToken | AbstractLabelToken>,
    hydratedLabels: Map<
        string,
        HydratedLabelToken | HydratedAbstractLabelToken
    >,
    seen = new Set<string>()
    // eslint-disable-next-line sonarjs/cognitive-complexity
): void => {
    if (hydratedLabels.has(label.id)) {
        return;
    }

    if (seen.has(label.id)) {
        throw new CompilationError(
            `Circular reference detected: ${[...seen].join(" -> ")} -> ${
                label.id
            }`,
            {
                tip: "Extending a label with itself is not allowed as labels cannot override their parents' properties or relationships.",
            }
        );
    }

    seen.add(label.id);

    // Base case
    if (label.extending === undefined) {
        hydratedLabels.set(
            label.id,
            is(label, TokenKind.ABSTRACT_LABEL)
                ? createHydratedAbstractLabel(label, [])
                : createHydratedLabel(label, [], [])
        );

        return;
    }

    const parentLabelId = label.extending.id;
    const parentLabel = knownLabels.get(parentLabelId);

    if (parentLabel === undefined) {
        throw new CompilationError(`Unknown label: ${parentLabelId}`);
    }

    hydrateLabel(parentLabel, knownLabels, hydratedLabels, seen);

    const hydratedParent = hydratedLabels.get(parentLabelId);

    if (hydratedParent === undefined) {
        throw new CompilationError(
            `Inconsistent state: expected ${parentLabelId} to be hydrated. This should never happen.`
        );
    }

    const parentProperties = hydratedParent.properties;
    const parentRelationships = is(hydratedParent, TokenKind.LABEL)
        ? hydratedParent.relationships
        : [];

    for (const parentProp of parentProperties) {
        if (label.properties.some((prop) => prop.id === parentProp.id)) {
            throw new CompilationError(
                `Invalid property: ${label.id}.${parentProp.id}`,
                {
                    tip: `The property ${parentProp.id} has already been defined in ${label.id}'s parent.`,
                }
            );
        }
    }

    for (const parentRel of parentRelationships) {
        if (is(label, TokenKind.ABSTRACT_LABEL)) {
            break;
        }

        if (label.relationships.some((rel) => rel.id === parentRel.id)) {
            throw new CompilationError(
                `Invalid relationship: ${label.id}.${parentRel.id}`,
                {
                    tip: `The relationship ${parentRel.id} has already been defined in ${label.id}'s parent.`,
                }
            );
        }
    }

    const hydratedLabel = is(label, TokenKind.ABSTRACT_LABEL)
        ? createHydratedAbstractLabel(label, parentProperties)
        : createHydratedLabel(label, parentProperties, parentRelationships);

    hydratedLabels.set(hydratedLabel.id, hydratedLabel);
};
