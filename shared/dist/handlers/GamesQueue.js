"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameQueue = void 0;
class GameQueue {
    constructor(gameName) {
        this.gameName = gameName;
        this.players = [];
        this.length = 0;
        this.ids = new Set();
    }
    add(id, player) {
        if (this.ids.has(id))
            return;
        this.players.push(player);
        this.length++;
        this.ids.add(id);
    }
    remove(playerId) {
        if (!this.ids.has(playerId))
            return;
        this.players = this.players.filter((i) => i.id != playerId);
        this.length--;
        this.ids.delete(playerId);
    }
}
exports.GameQueue = GameQueue;
