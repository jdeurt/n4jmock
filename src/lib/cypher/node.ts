import type { CypherSerializable } from "../../types/cypher-serializable.js";
import { QueryBuilder } from "./query-builder.js";

export class Node extends QueryBuilder {
    id: string;

    constructor(labels: string[]) {
        super();

        this.id = QueryBuilder.id(labels[0]);

        this._createNode(this.id, labels);
    }

    set(
        props: Record<string, CypherSerializable | CypherSerializable[]>
    ): this {
        this._set(this.id, props);

        return this;
    }
}
