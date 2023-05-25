"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Board = exports.TicTacToeGameState = exports.SimonGameState = exports.RPSWinCombination = exports.RPSOptionsValues = exports.gameNames = exports.Game = void 0;
class Game {
}
exports.Game = Game;
exports.gameNames = [
    "Simon Says",
    "connect Four",
    "Rock Paper Scissors",
    "Tic Tac Toe",
];
exports.RPSOptionsValues = ["rock", "paper", "scissors"];
exports.RPSWinCombination = [
    { winner: "rock", loser: "scissors" },
    { winner: "paper", loser: "rock" },
    { winner: "scissors", loser: "paper" },
];
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
class Board {
}
exports.Board = Board;
