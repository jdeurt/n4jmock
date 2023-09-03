import type { KnownType } from "../constants/known-type.js";
import type { AbstractLabelToken } from "../structs/tokens/abstract-label.js";
import type { EnumToken } from "../structs/tokens/enum.js";
import type { LabelToken } from "../structs/tokens/label.js";
import { TokenKind } from "../structs/tokens/token.js";
import type { CypherSerializable } from "../types/cypher-serializable.js";
import { is } from "./utils/kind.js";
import { mock } from "./utils/mock-type.js";
import { CypherQuery } from "./cypher/cypher-query.js";
import { Node } from "./cypher/node.js";
import { Relationship } from "./cypher/relationship.js";
import { CompilationError } from "./errors/compilation-error.js";

/**
 * Assumes the passed labels are already hydrated.
 * That is, they have been populated with the properties of their parent.
 */
export const transpile = (
    hydratedLabels: Map<string, LabelToken | AbstractLabelToken>,
    types: Map<string, EnumToken | KnownType>
): string => {
    const query = new CypherQuery();

    buildNodeCreationQueries(hydratedLabels, types, query);
    buildRelationshipQueries(hydratedLabels, query);

    return query.toString();
};

// eslint-disable-next-line sonarjs/cognitive-complexity
function buildRelationshipQueries(
    hydratedLabels: Map<string, LabelToken | AbstractLabelToken>,
    query: CypherQuery
) {
    for (const label of hydratedLabels.values()) {
        if (is(label, TokenKind.ABSTRACT_LABEL)) {
            continue;
        }

        for (const relationship of label.relationships) {
            for (const ref of relationship.refs) {
                const refLabel = hydratedLabels.get(ref.id);

                if (!refLabel) {
                    throw new CompilationError(`Unknown target: ${ref.id}`);
                }

                if (is(refLabel, TokenKind.ABSTRACT_LABEL)) {
                    throw new CompilationError(`Invalid target: ${ref.id}`, {
                        tip:
                            "Abstract labels cannot be used as a relationship target since they are not included in the resulting query. " +
                            "If you want to use this label as a target, remove the 'abstract' keyword.",
                    });
                }

                query.addRelationship(
                    new Relationship(
                        label.id,
                        refLabel.id,
                        relationship.id,
                        relationship.direction
                    )
                );
            }
        }
    }
}

function buildNodeCreationQueries(
    hydratedLabels: Map<string, LabelToken | AbstractLabelToken>,
    types: Map<string, EnumToken | KnownType>,
    query: CypherQuery
) {
    for (const label of hydratedLabels.values()) {
        if (is(label, TokenKind.ABSTRACT_LABEL)) {
            continue;
        }

        const mockedProps: Record<string, CypherSerializable> = {};

        for (const property of label.properties) {
            const type = types.get(property.ref.id);

            if (type === undefined) {
                throw new CompilationError(`Unknown type: ${property.ref.id}`, {
                    tip: `Types must be one of "string", "int", "float", "bool", or a defined enum.`,
                });
            }

            mockedProps[property.id] = mock(type, property);
        }

        query.addNode(new Node(label.id).set(mockedProps));
    }
}
