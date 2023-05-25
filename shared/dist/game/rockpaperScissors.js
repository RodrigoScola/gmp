"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RockPaperScissorsGame = exports.RockPaperScissorsMaxWins = void 0;
const usersHandler_1 = require("../handlers/usersHandler");
const game_1 = require("../types/game");
const RoundHandler_1 = require("../handlers/RoundHandler");
exports.RockPaperScissorsMaxWins = 5;
class RockPaperScissorsGame extends game_1.Game {
    constructor() {
        super();
        this.name = "Rock Paper Scissors";
        this.currentChoice = {};
        this.getWinnerCombination = (opt1, opt2) => {
            const combination = game_1.RPSWinCombination.find((combination) => {
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
            const player1Move = {
                id: player1.id,
                choice: player1.choice,
            };
            const player2Move = {
                id: player2.id,
                choice: player2.choice,
            };
            if (player1.choice == player2.choice) {
                return {
                    isTie: true,
                    loser: player1,
                    winner: player2,
                    moves: [player1Move, player2Move],
                };
            }
            if (this.getWinnerCombination(player1.choice, player2.choice) ==
                player1.choice) {
                return {
                    isTie: false,
                    loser: player2,
                    winner: player1,
                    moves: [player1Move, player2Move],
                };
            }
            return {
                isTie: false,
                loser: player1,
                winner: player2,
                moves: [player1Move, player2Move],
            };
        };
        this.rounds = new RoundHandler_1.RoundHandler();
        this.players = new usersHandler_1.PlayerHandler();
    }
    play(player, choice) {
        if (this.rounds.hasGameWinner())
            return;
        if (this.currentChoice[player.id] || !this.players.hasPlayer(player.id))
            return;
        this.currentChoice[player.id] = {
            id: player.id,
            choice: choice,
        };
        return;
    }
    addPlayer(player) {
        this.players.addPlayer(player);
    }
    isReady() {
        return this.getPlayers().length == 2;
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
        return ((_a = this.hasRoundWinner()) === null || _a === void 0 ? void 0 : _a.winner.id) == player.id;
    }
    getOpponents(player) {
        return Object.values(this.currentChoice).filter((i) => i.id != player.id);
    }
    isTie() {
        return Object.values(this.currentChoice).every((i) => i.choice);
    }
    newRound() {
        const roundWinner = this.hasRoundWinner();
        if (!roundWinner)
            return;
        this.rounds.addRound({
            isTie: roundWinner.isTie,
            moves: roundWinner,
            winner: {
                id: roundWinner.winner.id,
            },
        });
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
    getState() {
        return {
            moves: Object.values(this.currentChoice),
            name: this.name,
            players: this.getPlayers(),
            rounds: {
                count: this.rounds.count,
                rounds: this.rounds.rounds,
            },
        };
    }
    hasGameWin() {
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
}
exports.RockPaperScissorsGame = RockPaperScissorsGame;
