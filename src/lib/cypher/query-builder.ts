import type { CypherSerializable } from "../../types/cypher-serializable.js";
import { Direction } from "../../types/direction.js";

export abstract class QueryBuilder {
    private static idCounters: Record<string, number> = {};

    constructor(protected query = "") {}

    static id(label: string): string {
        if (!this.idCounters[label]) {
            this.idCounters[label] = 0;
        }

        return `${label.toLowerCase()}_${this.idCounters[label]++}`;
    }

    toString(): string {
        return this.query;
    }

    protected _createNode(id: string, labels: string[]): this {
        this.query += `CREATE (${id}${labels
            .map((label) => ":" + label)
            .join("")})\n`;

        return this;
    }

    protected _createRelationship(
        sourceLabel: string,
        destLabel: string,
        label: string,
        direction: Direction,
        limit = 1
    ): this {
        const idSource = QueryBuilder.id(sourceLabel);
        const idDest = QueryBuilder.id(destLabel);

        this.query += `MATCH (${idSource}:${sourceLabel}) WITH * LIMIT ${limit}\n`;
        this.query += `MATCH (${idDest}:${destLabel}) WITH * LIMIT ${limit}\n`;

        this.query +=
            "CREATE " +
            {
                [Direction.IN]: `(${idSource})<-[:${label}]-(${idDest})\n`,
                [Direction.OUT]: `(${idSource})-[:${label}]->(${idDest})\n`,
                [Direction.UNDIRECTED]: `(${idSource})-[:${label}]-(${idDest})\n`,
                [Direction.BOTH]:
                    `(${idSource})<-[:${label}]-(${idDest})\n` +
                    `CREATE (${idSource})-[:${label}]->(${idDest})\n`,
            }[direction];

        return this;
    }

    protected _set(
        id: string,
        key: string,
        value: CypherSerializable | CypherSerializable[]
    ): this;

    protected _set(
        id: string,
        props: Record<string, CypherSerializable | CypherSerializable[]>
    ): this;

    protected _set(
        id: string,
        ...args:
            | [string, CypherSerializable | CypherSerializable[]]
            | [Record<string, CypherSerializable | CypherSerializable[]>]
    ): this {
        if (args.length === 2) {
            if (Array.isArray(args[1])) {
                const arr: string[] = [];

                for (const x of args[1]) {
                    arr.push(typeof x === "string" ? `'${x}'` : String(x));
                }

                this.query += `SET ${id}.${args[0]} = [${arr.join(", ")}]\n`;

                return this;
            }

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

    protected _end() {
        this.query += ";\n";
    }
}
