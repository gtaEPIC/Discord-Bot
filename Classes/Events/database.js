"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
require("dotenv").config();
function setup() {
    mongoose_1["default"].connect(process.env.MONGO_URL).then(function () {
        console.log("Connected to MongoDB");
    })["catch"](function (err) {
        console.error("Failed to connect to MongoDB");
        console.error(err);
        process.exit(1);
    });
}
exports["default"] = setup;
//# sourceMappingURL=database.js.map