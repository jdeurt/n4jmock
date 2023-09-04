import { Direction } from "../../types/direction.js";
export class QueryBuilder {
    query;
    static idCounters = {};
    constructor(query = "") {
        this.query = query;
    }
    static id(label) {
        if (!this.idCounters[label]) {
            this.idCounters[label] = 0;
        }
        return `${label.toLowerCase()}_${this.idCounters[label]++}`;
    }
    toString() {
        return this.query;
    }
    _createNode(id, labels) {
        this.query += `CREATE (${id}${labels
            .map((label) => ":" + label)
            .join("")})\n`;
        return this;
    }
    _createRelationship(sourceLabel, destLabel, label, direction) {
        const idSource = QueryBuilder.id(sourceLabel);
        const idDest = QueryBuilder.id(destLabel);
        this.query += `MATCH (${idSource}:${sourceLabel}), (${idDest}:${destLabel})\n`;
        this.query +=
            "CREATE " +
                {
                    [Direction.IN]: `(${idSource})<-[:${label}]-(${idDest})\n`,
                    [Direction.OUT]: `(${idSource})-[:${label}]->(${idDest})\n`,
                    [Direction.UNDIRECTED]: `(${idSource})-[:${label}]-(${idDest})\n`,
                    [Direction.BOTH]: `(${idSource})<-[:${label}]-(${idDest})\n` +
                        `(${idSource})-[:${label}]->(${idDest})\n`,
                }[direction];
        return this;
    }
    _set(id, ...args) {
        if (args.length === 2) {
            if (Array.isArray(args[1])) {
                const arr = [];
                for (const x of args[1]) {
                    arr.push(typeof x === "string" ? `'${x}'` : String(x));
                }
                this.query += `SET ${id}.${args[0]} = [${arr.join(", ")}]\n`;
                return this;
            }
            this.query += `SET ${id}.${args[0]} = ${typeof args[1] === "string" ? `'${args[1]}'` : String(args[1])}\n`;
            return this;
        }
        for (const [key, value] of Object.entries(args[0])) {
            this._set(id, key, value);
        }
        return this;
    }
}
