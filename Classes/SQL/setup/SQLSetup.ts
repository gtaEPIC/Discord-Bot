import {ISqlite, open} from 'sqlite';
import SQLCreate from "./SQLCreate";
import SQLStandard, {types} from "./SQLStandard";
import {DBConfig, removeFromArray} from "../../Extras";


const standardGuildSettings: Array<SQLStandard> = [
    new SQLStandard({name: "Guild", type: types.TEXT, unique: true}),
    new SQLStandard({name: "Music_Channel", type: types.TEXT}),
];

export default async function (dest: string) {
    SQLCreate(dest);
    let db = await open(DBConfig);
    //await db.exec("INSERT INTO Shirts VALUES (2, 'n')");
    await checkTable("Guild_Settings", db, standardGuildSettings);

}

async function checkTable(tableName: string, db, standards) {
    try {
        let columns: ISqlite.SqlType = '';
        let allNames: Array<SQLStandard> = [];
        for (let standard of standards) {
            columns += standard.init() + ',';
            allNames.push(standard);
        }
        columns = columns.substr(0, columns.length - 1);
        //console.log(columns);
        await db.exec('CREATE TABLE IF NOT EXISTS ' + tableName + ' (' + columns + ')');
        let result = await db.all('PRAGMA table_info (' + tableName + ')');
        let names: Array<SQLStandard> = [];
        for (let resultElement of result) {
            names.push(new SQLStandard({
                name: resultElement.name,
                type: resultElement.type
            }));
        }
        for (let name of names) {
            for (let allName of allNames) {
                if (name.name === allName.name) {
                    removeFromArray(allName, allNames);
                    break;
                }
            }
        }
        for (let missing of allNames) {
            await db.exec('ALTER TABLE ' + tableName + ' ADD ' + missing.name + ' ' + missing.type);
            console.log("Added New Column to " + tableName + ": " + missing.name + ' ' + missing.type);
        }
        //console.log(result);
    }catch (e) {
        console.log(e)
    }
}