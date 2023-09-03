import type { Direction } from "../../types/direction.js";
import type { Node } from "./node.js";
import { QueryBuilder } from "./query-builder.js";

export class Relationship extends QueryBuilder {
    constructor(
        sourceLabel: string,
        destLabel: string,
        label: string,
        direction: Direction
    ) {
        super();

        this._createRelationship(sourceLabel, destLabel, label, direction);
    }
}
