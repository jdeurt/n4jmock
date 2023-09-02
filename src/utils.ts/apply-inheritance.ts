import type { AbstractLabelToken } from "../structs/tokens/abstract-label.js";
import type { LabelToken } from "../structs/tokens/label.js";
import { TokenKind } from "../structs/tokens/token.js";
import { is } from "./kind.js";
import { panic } from "./panic.js";

export const applyInheritance = (
    label: LabelToken | AbstractLabelToken,
    knownLabels: Map<string, LabelToken | AbstractLabelToken>,
    knownHydratedLabels: Map<string, LabelToken | AbstractLabelToken>
) => {
    const parentId = label.extending?.id;

    if (!parentId) {
        return;
    }

    const parentLabel = knownLabels.get(parentId);

    if (!parentLabel) {
        panic(`Unknown parent label: ${parentId}.`);

        return;
    }

    if (knownHydratedLabels.has(parentId)) {
        return;
    }

    applyInheritance(parentLabel, knownLabels, knownHydratedLabels);

    for (const property of parentLabel.properties) {
        if (label.properties.some((p) => p.id === property.id)) {
            continue;
        }

        label.properties.push(property);
    }

    if (is(label, TokenKind.LABEL) && is(parentLabel, TokenKind.LABEL)) {
        for (const relationship of parentLabel.relationships) {
            if (label.relationships.some((rel) => rel.id === relationship.id)) {
                continue;
            }

            label.relationships.push(relationship);
        }
    }

    knownHydratedLabels.set(parentId, parentLabel);
};
