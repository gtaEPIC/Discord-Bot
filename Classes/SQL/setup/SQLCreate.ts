import * as fs from "fs";
const sqlite3 = require('sqlite3').verbose();

export default function (dest) {
    if (!fs.existsSync(dest))
        new sqlite3.Database(dest, (err) => {
            if (err) {
                console.error(err.message);
            }else{
                console.log("Database created");
            }
        })
}