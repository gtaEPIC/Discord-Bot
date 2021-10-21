"use strict";
exports.__esModule = true;
exports.types = exports.SQLStandardOptions = void 0;
var SQLStandardOptions = /** @class */ (function () {
    function SQLStandardOptions() {
        this.type = types.TEXT;
    }
    return SQLStandardOptions;
}());
exports.SQLStandardOptions = SQLStandardOptions;
var SQLStandard = /** @class */ (function () {
    function SQLStandard(options) {
        this.type = types.TEXT;
        this["default"] = '';
        this.unique = false;
        this.primary = false;
        this.name = options.name;
        this.type = options.type;
        if (options["default"])
            this["default"] = options["default"];
        if (options.unique)
            this.unique = options.unique;
        if (options.primary)
            this.primary = options.primary;
    }
    SQLStandard.prototype.init = function () {
        var final = this.name + ' ' + this.type;
        if (this["default"] !== '')
            final += ' default ' + this["default"];
        if (this.unique)
            final += ' unique';
        if (this.primary)
            final += ' primary key';
        return final;
    };
    return SQLStandard;
}());
exports["default"] = SQLStandard;
var types;
(function (types) {
    types["TEXT"] = "TEXT";
    types["INTEGER"] = "INTEGER";
    types["BOOLEAN"] = "BOOLEAN";
})(types = exports.types || (exports.types = {}));
//# sourceMappingURL=SQLStandard.js.map