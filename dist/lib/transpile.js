import { mock } from "./utils/mock-type.js";
import { CypherQuery } from "./cypher/cypher-query.js";
import { Node } from "./cypher/node.js";
import { Relationship } from "./cypher/relationship.js";
import { CompilationError } from "./errors/compilation-error.js";
import { options } from "../globals.js";
/**
 * Assumes the passed labels are already hydrated.
 * That is, they have been populated with the properties of their parent.
 */
export const transpile = (hydratedLabels, types) => {
    const query = new CypherQuery();
    buildNodeCreationQueries(hydratedLabels, types, query);
    buildRelationshipQueries(hydratedLabels, query);
    return query.toString();
};
// eslint-disable-next-line sonarjs/cognitive-complexity
function buildRelationshipQueries(hydratedLabels, query) {
    for (const label of hydratedLabels.values()) {
        if (label.abstract) {
            continue;
        }
        for (const relationship of label.relationships) {
            for (const ref of relationship.refs) {
                const refLabel = hydratedLabels.get(ref.id);
                if (!refLabel) {
                    throw new CompilationError(`Unknown target: ${ref.id}`, {
                        cause: ref.location,
                    });
                }
                query.addRelationship(new Relationship(label.id.name, refLabel.id.name, relationship.id, relationship.direction, options.relationships));
            }
        }
    }
}
function buildNodeCreationQueries(hydratedLabels, types, query) {
    for (const label of hydratedLabels.values()) {
        if (label.abstract) {
            continue;
        }
        for (let i = 0; i < options.nodes; i++) {
            const mockedProps = {};
            for (const property of label.properties) {
                const type = types.get(property.ref.id);
                if (type === undefined) {
                    throw new CompilationError(`Unknown type: ${property.ref.id}`, {
                        tip: `Types must be one of "string", "int", "float", "bool", or a defined enum.`,
                        cause: property.ref.location,
                    });
                }
                mockedProps[property.id] = mock(type, property);
            }
            query.addNode(new Node(label.inheritanceChain).set(mockedProps).end());
        }
    }
}
