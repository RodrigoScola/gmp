"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameQueue = exports.MatchQueue = void 0;
const game_1 = require("../../shared/types/game");
const gameUtils_1 = require("../../shared/game/gameUtils");
const usersHandler_1 = require("../../shared/handlers/usersHandler");
const GamesQueue_1 = require("./lib/GamesQueue");
class MatchQueue {
    constructor() {
        this.players = new usersHandler_1.PlayerHandler();
        const gamesQueue = {};
        game_1.gameNames.forEach((game) => {
            const gameId = (0, gameUtils_1.getGameData)(game).id;
            gamesQueue[gameId] = new GamesQueue_1.GameQueue(game);
        });
        this.gamesQueue = gamesQueue;
    }
    addPlayer(player) {
        this.players.addPlayer(player);
        console.log(player);
        player.games = Array.isArray(player.games) ? player.games : [player.games];
        player.games.forEach((game) => {
            const gameId = (0, gameUtils_1.getGameData)(game.name).id;
            this.gamesQueue[gameId].add(player.id, player);
        });
        return player;
    }
    removePlayer(player) {
        const queues = Object.values(this.gamesQueue);
        queues.forEach((queue) => {
            queue.remove(player.id);
        });
    }
    findMatch(userId) {
        const player = this.players.getPlayer(userId);
        if (!player)
            return;
        const queues = Object.values(this.gamesQueue).filter((queue) => {
            const gamedata = (0, gameUtils_1.getGameData)(queue.gameName);
            const includes = !!queue.players.find((x) => x.id == player.id);
            const l = queue.length >= gamedata.playerCount;
            return includes && l;
        });
        return queues[Math.floor(Math.random() * queues.length)];
    }
    matchPlayer(queue) {
        const data = (0, gameUtils_1.getGameData)(queue.gameName);
        console.log(queue.length, data.playerCount);
        if (queue.length == data.playerCount) {
            const players = queue.players.slice(0, data.playerCount);
            console.log(players);
            return players;
        }
        return;
    }
}
exports.MatchQueue = MatchQueue;
exports.gameQueue = new MatchQueue();
