"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RockPaperScissorsGame = exports.RoundHandler = exports.RockPaperScissorsMaxWins = void 0;
const types_1 = require("../../../web/types");
const TicTacToeGame_1 = require("./TicTacToeGame");
exports.RockPaperScissorsMaxWins = 5;
class RoundHandler {
    constructor() {
        this.count = 0;
        this.maxWins = exports.RockPaperScissorsMaxWins;
        this.rounds = [];
    }
    addRound(round) {
        this.rounds.push(round);
        this.count++;
    }
    countWins(playerId) {
        return this.rounds.filter((i) => i.winner.id == playerId && i.isTie == false).length;
    }
    isWinner(playerId) {
        return this.countWins(playerId) >= this.maxWins;
    }
    hasGameWinner() {
        let players = {};
        if (this.rounds.length == 0)
            return false;
        for (let i = 0; i < this.rounds.length; i++) {
            const round = this.rounds[i];
            if (!round)
                continue;
            if (!(round === null || round === void 0 ? void 0 : round.isTie)) {
                if (players[round.winner.id]) {
                    players[round.winner.id]++;
                }
                else {
                    players[round.winner.id] = 1;
                }
            }
        }
        const winner = Object.keys(players).find((i) => players[i] >= this.maxWins);
        return winner;
    }
}
exports.RoundHandler = RoundHandler;
class RockPaperScissorsGame {
    constructor() {
        this.players = new TicTacToeGame_1.PlayerHandler();
        this.currentChoice = {};
        this.rounds = new RoundHandler();
        this.getWinnerCombination = (opt1, opt2) => {
            const combination = types_1.RockPaperScissorsWinCombination.find((combination) => {
                return ((combination.winner == opt1 && combination.loser == opt2) ||
                    (combination.winner == opt2 && combination.loser == opt1));
            });
            if (combination) {
                return combination.winner;
            }
            return opt1;
        };
        this.getWinner = (player1, player2) => {
            if (!player1 || !player2)
                return null;
            if (player1.choice == null || player2.choice == null)
                return null;
            if (player1.choice == player2.choice) {
                return {
                    isTie: true,
                    loser: player1,
                    winner: player2,
                };
            }
            if (this.getWinnerCombination(player1.choice, player2.choice) ==
                player1.choice) {
                return {
                    isTie: false,
                    loser: player2,
                    winner: player1,
                };
            }
            return {
                isTie: false,
                loser: player1,
                winner: player2,
            };
        };
    }
    play(player, choice) {
        if (this.rounds.hasGameWinner())
            return;
        if (this.currentChoice[player.id] || !this.players.hasPlayer(player.id))
            return;
        this.currentChoice[player.id] = Object.assign(Object.assign({}, player), { choice: choice });
        console.log(this.currentChoice);
        return;
    }
    addPlayer(player) {
        this.players.addPlayer(player);
    }
    getPlayers() {
        return this.players.getPlayers();
    }
    hasRoundWinner() {
        const [player1, player2] = this.getPlayers();
        if (!player1 || !player2)
            return null;
        const player1Choice = this.currentChoice[player1.id];
        const player2Choice = this.currentChoice[player2.id];
        if (!player1Choice || !player2Choice)
            return null;
        return this.getWinner(Object.assign(Object.assign({}, player1), { choice: player1Choice.choice }), Object.assign(Object.assign({}, player2), { choice: player2Choice.choice }));
    }
    isRoundWinner(player) {
        var _a;
        return ((_a = this.hasRoundWinner()) === null || _a === void 0 ? void 0 : _a.id) == player.id;
    }
    newRound() {
        const roundWinner = this.hasRoundWinner();
        if (!roundWinner)
            return;
        this.rounds.addRound(roundWinner);
        this.currentChoice = {};
    }
    hasGameWinner() {
        const players = this.getPlayers();
        for (let i = 0; i < players.length; i++) {
            const player = players[i];
            if (!player)
                continue;
            if (this.isGameWinner(player.id)) {
                return player;
            }
        }
        return null;
    }
    isGameWinner(playerId) {
        return this.rounds.isWinner(playerId);
    }
}
exports.RockPaperScissorsGame = RockPaperScissorsGame;
