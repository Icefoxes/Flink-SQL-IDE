import { ResourceTable } from 'src/app/@core/model';

export class TableParser {
    constructor(private table: ResourceTable) { }

    parse(): string {
        const props = [];
        for (const key in this.table.props) {
            if (this.table.props.hasOwnProperty(key)) {
                props.push(`'${key}' = '${this.table.props[key]}'`);
            }
        }
        return `CREATE TABLE ${this.table.name} (\n` +
            this.table.columns.map(col => `${col.name} ${col.type}`).join(`,\n`) + '\n) WITH (\n' + props.join(',\n');
    }

    parseColumn(): string {
        return 'SELECT \n' + this.table.columns.map(col => `${col.name}`).join(`,\n`) + `\nFROM ${this.table.name}`;
    }

    parseInsertInto(): string {
        return `INSERT INTO ${this.table.name} VALUES\n(\n ${this.table.columns.map(col => `${col.name}`).join(`,\n`)}\n)`;
    }
}
