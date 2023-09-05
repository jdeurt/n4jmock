import type { Direction } from "../../types/direction.js";
import { QueryBuilder } from "./query-builder.js";

export class Relationship extends QueryBuilder {
    constructor(
        sourceLabel: string,
        destLabel: string,
        label: string,
        direction: Direction,
        limit = 1
    ) {
        super();

        this._createRelationship(
            sourceLabel,
            destLabel,
            label,
            direction,
            limit
        );

        this._end();
    }
}
