"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.CounterModel = void 0;
var mongoose_1 = require("mongoose");
var discord_js_1 = require("discord.js");
var CounterSchema = new mongoose_1["default"].Schema({
    _id: mongoose_1["default"].Types.ObjectId,
    seq: Number,
    owner: String,
    content: String,
    messageID: String
});
exports.CounterModel = mongoose_1["default"].model('Counter', CounterSchema);
var Counter = /** @class */ (function () {
    function Counter(data) {
        this._id = data._id;
        this.content = data.content;
        this.messageID = data.messageID;
        this.owner = data.owner;
        this.seq = data.seq;
    }
    Counter.create = function (owner, content, messageID, startingNumber) {
        if (startingNumber === void 0) { startingNumber = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var counter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        counter = new Counter({
                            _id: null,
                            seq: startingNumber,
                            owner: owner,
                            content: content,
                            messageID: messageID
                        });
                        return [4 /*yield*/, counter.save()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, counter];
                }
            });
        });
    };
    Counter.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            var newModel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newModel = new exports.CounterModel(this);
                        if (!this._id) {
                            newModel.isNew = true;
                            newModel._id = new mongoose_1["default"].Types.ObjectId();
                        }
                        else {
                            newModel.isNew = false;
                        }
                        return [4 /*yield*/, newModel.save()];
                    case 1:
                        _a.sent();
                        this._id = newModel._id;
                        return [2 /*return*/];
                }
            });
        });
    };
    Counter.fetchById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var model;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, exports.CounterModel.findById(id)];
                    case 1:
                        model = _a.sent();
                        return [2 /*return*/, new Counter(model)];
                }
            });
        });
    };
    Counter.fetchByDiscordMessageId = function (messageId) {
        return __awaiter(this, void 0, void 0, function () {
            var model;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, exports.CounterModel.findOne({ messageID: messageId })];
                    case 1:
                        model = _a.sent();
                        return [2 /*return*/, new Counter(model)];
                }
            });
        });
    };
    Counter.prototype.increment = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.seq++;
                        return [4 /*yield*/, this.save()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Counter.prototype.decrement = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.seq--;
                        return [4 /*yield*/, this.save()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Counter.prototype.toDiscordString = function () {
        return this.content + ": " + this.seq + "\n" + (this.owner ? "Only <@" + this.owner + "> can use this" :
            "Anyone can use this");
    };
    Counter.prototype.getButtons = function () {
        var actionRow = new discord_js_1.ActionRowBuilder();
        var addButton = new discord_js_1.ButtonBuilder().setStyle(discord_js_1.ButtonStyle.Primary).setCustomId("counter+=+add").setLabel("+1");
        var removeButton = new discord_js_1.ButtonBuilder().setStyle(discord_js_1.ButtonStyle.Danger).setCustomId("counter+=+remove").setLabel("-1");
        actionRow.addComponents(addButton, removeButton);
        return actionRow;
    };
    return Counter;
}());
exports["default"] = Counter;
//# sourceMappingURL=Counter.js.map