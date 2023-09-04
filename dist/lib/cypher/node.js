import { QueryBuilder } from "./query-builder.js";
export class Node extends QueryBuilder {
    id;
    constructor(label) {
        super();
        this.id = QueryBuilder.id(label);
        this._createNode(this.id, label);
    }
    set(props) {
        this._set(this.id, props);
        return this;
    }
}
