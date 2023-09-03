import type { CypherSerializable } from "../../types/cypher-serializable.js";
import { Direction } from "../../types/direction.js";

export abstract class QueryBuilder {
    private static idCounters: Record<string, number> = {};

    constructor(protected query = "") {}

    static id(label: string): string {
        if (!this.idCounters[label]) {
            this.idCounters[label] = 0;
        }

        return `${label}_${this.idCounters[label]++}`;
    }

    toString(): string {
        return this.query;
    }

    protected _createNode(id: string, label: string): this {
        this.query += `CREATE (${id}:${label})\n`;

        return this;
    }

    protected _createRelationship(
        sourceLabel: string,
        destLabel: string,
        label: string,
        direction: Direction
    ): this {
        const idSource = QueryBuilder.id(sourceLabel);
        const idDest = QueryBuilder.id(destLabel);

        this.query += `MATCH (${idSource}:${sourceLabel}), (${idDest}:${destLabel})\n`;

        this.query +=
            "CREATE " +
            {
                [Direction.IN]: `(${idSource})<-[:${label}]-(${idDest})\n`,
                [Direction.OUT]: `(${idSource})-[:${label}]->(${idDest})\n`,
                [Direction.UNDIRECTED]: `(${idSource})-[:${label}]-(${idDest})\n`,
                [Direction.BOTH]:
                    `(${idSource})<-[:${label}]-(${idDest})\n` +
                    `(${idSource})-[:${label}]->(${idDest})\n`,
            }[direction];

        return this;
    }

    protected _set(id: string, key: string, value: CypherSerializable): this;

    protected _set(id: string, props: Record<string, CypherSerializable>): this;

    protected _set(
        id: string,
        ...args:
            | [string, CypherSerializable]
            | [Record<string, CypherSerializable>]
    ): this {
        if (args.length === 2) {
            this.query += `SET ${id}.${args[0]} = ${
                typeof args[1] === "string" ? `'${args[1]}'` : String(args[1])
            }\n`;

            return this;
        }

        for (const [key, value] of Object.entries(args[0])) {
            this._set(id, key, value);
        }

        return this;
    }
}
