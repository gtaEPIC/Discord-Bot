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
var Resume_1 = require("../../Commands/Music/Resume");
var PlayButton = /** @class */ (function (_super) {
    __extends(PlayButton, _super);
    function PlayButton() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.buttonName = "play";
        return _this;
    }
    PlayButton.prototype.execute = function (interaction) {
        new Resume_1["default"]().execute(interaction, []).then();
    };
    return PlayButton;
}(Buttons_1["default"]));
exports["default"] = PlayButton;
//# sourceMappingURL=PlayButton.js.map