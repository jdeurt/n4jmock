import { QueryBuilder } from "./query-builder.js";
export class CypherQuery extends QueryBuilder {
    addNode(node) {
        this.query += node.toString();
    }
    addRelationship(relationship) {
        this.query += relationship.toString();
    }
}
