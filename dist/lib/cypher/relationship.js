import { QueryBuilder } from "./query-builder.js";
export class Relationship extends QueryBuilder {
    constructor(sourceLabel, destLabel, label, direction) {
        super();
        this._createRelationship(sourceLabel, destLabel, label, direction);
    }
}
