"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameQueue = exports.MatchQueue = void 0;
const crypto_1 = require("crypto");
const gameUtils_1 = require("../game/gameUtils");
const game_1 = require("../types/game");
const GamesQueue_1 = require("./GamesQueue");
const usersHandler_1 = require("./usersHandler");
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
        player.games = Array.isArray(player.games)
            ? player.games
            : [player.games];
        player.games.forEach((game) => {
            const gameId = (0, gameUtils_1.getGameData)(game.name).id;
            this.gamesQueue[gameId].add(player.id, player);
        });
        return player;
    }
    removePlayer(player) {
        const queues = Object.values(this.gamesQueue);
        this.players.removePlayer(player);
        queues.forEach((queue) => {
            queue.remove(player);
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
    newMatch(game, players) {
        return {
            id: (0, crypto_1.randomUUID)(),
            game: game,
            players: players,
        };
    }
    matchPlayer(queue) {
        const data = (0, gameUtils_1.getGameData)(queue.gameName);
        if (queue.length == data.playerCount) {
            const players = queue.players.slice(0, data.playerCount);
            players.forEach((player) => {
                this.removePlayer(player.id);
            });
            return players;
        }
        return;
    }
}
exports.MatchQueue = MatchQueue;
exports.gameQueue = new MatchQueue();
