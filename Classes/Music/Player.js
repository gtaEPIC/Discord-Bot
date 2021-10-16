"use strict";
exports.__esModule = true;
var Queue_1 = require("./Queue");
var Player = /** @class */ (function () {
    function Player(client) {
        this.queues = new Map();
        this.client = client;
    }
    Player.prototype.createQueue = function (guild, vc, textChannel) {
        if (this.queues.has(guild.id))
            return this.queues.get(guild.id);
        var queue = new Queue_1["default"](this, guild, vc, textChannel);
        this.queues.set(guild.id, queue);
        return queue;
    };
    Player.prototype.on = function (eventName, event) {
        switch (eventName) {
            case "onEnd":
                this.onEnd = event;
                break;
            case "onEmpty":
                this.onEmpty = event;
                break;
            case "onStart":
                this.onStart = event;
                break;
            default:
                throw new Error(eventName + " is not a valid event");
        }
    };
    return Player;
}());
exports["default"] = Player;
//# sourceMappingURL=Player.js.map