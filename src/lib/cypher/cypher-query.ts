import type { Node } from "./node.js";
import { QueryBuilder } from "./query-builder.js";
import type { Relationship } from "./relationship.js";

export class CypherQuery extends QueryBuilder {
    addNode(node: Node) {
        this.query += node.toString();
    }

    addRelationship(relationship: Relationship) {
        this.query += relationship.toString();
    }
}
