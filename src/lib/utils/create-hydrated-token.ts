import { tokenSymbol } from "../../constants/symbols.js";
import type { AbstractLabelToken } from "../../structs/tokens/abstract-label.js";
import type {
    HydratedAbstractLabelToken,
    HydratedLabelToken,
} from "../../structs/tokens/hydrated-label.js";
import type { LabelToken } from "../../structs/tokens/label.js";
import type { PropertyToken } from "../../structs/tokens/property.js";
import type { RelationshipToken } from "../../structs/tokens/relationship.js";
import { TokenKind } from "../../structs/tokens/token.js";

export const createHydratedLabel = (
    labelToken: LabelToken,
    props: PropertyToken[],
    rels: RelationshipToken[]
): HydratedLabelToken => ({
    [tokenSymbol]: TokenKind.LABEL,

    id: labelToken.id,
    properties: [...labelToken.properties, ...props],
    relationships: [...labelToken.relationships, ...rels],
});

export const createHydratedAbstractLabel = (
    labelToken: AbstractLabelToken,
    props: PropertyToken[]
): HydratedAbstractLabelToken => ({
    [tokenSymbol]: TokenKind.ABSTRACT_LABEL,

    id: labelToken.id,
    properties: [...labelToken.properties, ...props],
});
