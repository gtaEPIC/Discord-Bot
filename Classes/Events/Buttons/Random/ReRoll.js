"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Buttons_1 = require("../Buttons");
var RollDice_1 = require("../../Commands/Random/RollDice");
var ReRoll = /** @class */ (function (_super) {
    __extends(ReRoll, _super);
    function ReRoll() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.buttonName = "re-roll";
        return _this;
    }
    ReRoll.prototype.execute = function (interaction, args) {
        new RollDice_1["default"]().rollDice(parseInt(args[0]), interaction).then();
    };
    return ReRoll;
}(Buttons_1["default"]));
exports["default"] = ReRoll;
//# sourceMappingURL=ReRoll.js.map