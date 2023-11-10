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
Object.defineProperty(exports, "__esModule", { value: true });
var Downloaders_1 = require("./Downloaders");
var Direct = /** @class */ (function (_super) {
    __extends(Direct, _super);
    function Direct() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Direct.prototype.download = function (url, point) {
        // Download the file using axios
        return new Promise(function (resolve, reject) {
        });
        // return new Promise((resolve, reject) => {
        //     axios.get(url).then(res => {
        //         console.log(res)
        //         resolve();
        //         // if (res.headers["content-type"] === "audio/mpeg") {
        //         //     resolve(res.data);
        //         // } else {
        //         //     reject(new Error("Invalid Content-Type"));
        //         // }
        //     })
        // });
    };
    return Direct;
}(Downloaders_1.default));
exports.default = Direct;
//# sourceMappingURL=Direct.js.map