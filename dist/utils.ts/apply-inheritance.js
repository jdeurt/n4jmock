import { TokenKind } from "../structs/tokens/token.js";
import { is } from "./kind.js";
import { panic } from "./panic.js";
export const applyInheritance = (label, knownLabels, knownHydratedLabels) => {
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
