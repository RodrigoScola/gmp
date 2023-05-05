"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicTacToeGame = exports.PlayerHandler = void 0;
class PlayerHandler {
    constructor() {
        this.players = {};
    }
    addPlayer(player) {
        if (this.players[player.id])
            return;
        this.players[player.id] = player;
    }
    getPlayers() {
        return Object.values(this.players);
    }
    getPlayer(playerId) {
        return this.players[playerId];
    }
    removePlayer(playerId) {
        delete this.players[playerId];
    }
    hasPlayer(playerId) {
        return !!this.players[playerId];
    }
}
exports.PlayerHandler = PlayerHandler;
class TicTacToeGame {
    constructor() {
        this.players = new PlayerHandler();
    }
    addPlayer(player) {
        this.players.addPlayer(player);
    }
    getPlayers() {
        return this.players.getPlayers();
    }
    hasGameWinner() {
        return null;
    }
    play(choice, move) {
        console.log(choice, move);
    }
    hasRoundWinner() {
        return null;
    }
}
exports.TicTacToeGame = TicTacToeGame;
