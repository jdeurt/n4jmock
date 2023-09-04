import { QueryBuilder } from "./query-builder.js";
export class Node extends QueryBuilder {
    id;
    constructor(labels) {
        super();
        this.id = QueryBuilder.id(labels[0]);
        this._createNode(this.id, labels);
    }
    set(props) {
        this._set(this.id, props);
        return this;
    }
}
