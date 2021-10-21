"use strict";
exports.__esModule = true;
var fs = require("fs");
var sqlite3 = require('sqlite3').verbose();
function default_1(dest) {
    if (!fs.existsSync(dest))
        new sqlite3.Database(dest, function (err) {
            if (err) {
                console.error(err.message);
            }
            else {
                console.log("Database created");
            }
        });
}
exports["default"] = default_1;
//# sourceMappingURL=SQLCreate.js.map