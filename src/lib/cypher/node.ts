import type { CypherSerializable } from "../../types/cypher-serializable.js";
import { QueryBuilder } from "./query-builder.js";

export class Node extends QueryBuilder {
    id: string;

    constructor(label: string) {
        super();

        this.id = QueryBuilder.id(label);

        this._createNode(this.id, label);
    }

    set(props: Record<string, CypherSerializable>): this {
        this._set(this.id, props);

        return this;
    }
}
