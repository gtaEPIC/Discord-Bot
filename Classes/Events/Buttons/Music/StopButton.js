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
var Stop_1 = require("../../Commands/Music/Stop");
var StopButton = /** @class */ (function (_super) {
    __extends(StopButton, _super);
    function StopButton() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.buttonName = "stop";
        return _this;
    }
    StopButton.prototype.execute = function (interaction) {
        new Stop_1["default"]().execute(interaction, []).then();
    };
    return StopButton;
}(Buttons_1["default"]));
exports["default"] = StopButton;
//# sourceMappingURL=StopButton.js.map