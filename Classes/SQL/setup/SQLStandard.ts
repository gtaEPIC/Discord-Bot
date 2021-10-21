import {ISqlite} from "sqlite";

export class SQLStandardOptions {
    name: string;
    type: types = types.TEXT;
    default?: string;
    unique?: boolean;
    primary?: boolean;
}

export default class SQLStandard {
    name: string;
    type: types = types.TEXT;
    default: string = '';
    unique: boolean = false;
    primary: boolean = false;


    constructor(options: SQLStandardOptions) {
        this.name = options.name;
        this.type = options.type;
        if (options.default) this.default = options.default;
        if (options.unique) this.unique = options.unique;
        if (options.primary) this.primary = options.primary;
    }

    init?(): ISqlite.SqlType {
        let final: ISqlite.SqlType = this.name + ' ' + this.type;
        if (this.default !== '') final += ' default ' + this.default;
        if (this.unique) final += ' unique';
        if (this.primary) final += ' primary key';
        return final;
    }
}

export enum types {
    TEXT = "TEXT",
    INTEGER = "INTEGER",
    BOOLEAN = "BOOLEAN"
}