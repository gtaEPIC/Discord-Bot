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
var Skip_1 = require("../../Commands/Music/Skip");
var SkipButton = /** @class */ (function (_super) {
    __extends(SkipButton, _super);
    function SkipButton() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.buttonName = "skip";
        return _this;
    }
    SkipButton.prototype.execute = function (interaction) {
        new Skip_1["default"]().execute(interaction, []).then();
    };
    return SkipButton;
}(Buttons_1["default"]));
exports["default"] = SkipButton;
//# sourceMappingURL=SkipButton.js.map