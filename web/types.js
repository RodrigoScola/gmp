"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RockPaperScissorsWinCombination = exports.RockPaperScissorsOptionsValues = exports.TicTacToeGameState = exports.SimonGameState = exports.GameState = exports.gameNames = void 0;
const rockpaperScissors_1 = require("@/../server/dist/game/rockpaperScissors");
exports.gameNames = [
    "Simon Says",
    "connect Four",
    "Rock Paper Scissors",
    "Tic Tac Toe",
];
var GameState;
(function (GameState) {
    GameState[GameState["selecting"] = 0] = "selecting";
    GameState[GameState["waiting"] = 1] = "waiting";
    GameState[GameState["playing"] = 2] = "playing";
    GameState[GameState["results"] = 3] = "results";
    GameState[GameState["end"] = 4] = "end";
})(GameState = exports.GameState || (exports.GameState = {}));
var SimonGameState;
(function (SimonGameState) {
    SimonGameState["START"] = "Start";
    SimonGameState["PLAYING"] = "Playing";
    SimonGameState["END"] = "End";
    SimonGameState["WAITING"] = "Waiting";
})(SimonGameState = exports.SimonGameState || (exports.SimonGameState = {}));
var TicTacToeGameState;
(function (TicTacToeGameState) {
    TicTacToeGameState["START"] = "Start";
    TicTacToeGameState["PLAYING"] = "Playing";
    TicTacToeGameState["END"] = "End";
    TicTacToeGameState["TIE"] = "TIE";
    TicTacToeGameState["ENEMYTURN"] = "Enemy Turn";
    TicTacToeGameState["WAITING"] = "Waiting";
})(TicTacToeGameState = exports.TicTacToeGameState || (exports.TicTacToeGameState = {}));
exports.RockPaperScissorsOptionsValues = [
    "rock",
    "paper",
    "scissors",
];
exports.RockPaperScissorsWinCombination = [
    { winner: "rock", loser: "scissors" },
    { winner: "paper", loser: "rock" },
    { winner: "scissors", loser: "paper" },
];
const g = new rockpaperScissors_1.RockPaperScissorsGame();
