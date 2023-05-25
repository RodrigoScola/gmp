"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGameData = exports.games = void 0;
exports.games = {
    0: {
        id: 0,
        name: "connect Four",
        playerCount: 2,
        isMultiplayer: true,
        description: "Its the classic game you love to play with your friends and family. Can you connect four of your coloured disks by dropping them into the holder before your opponent does?",
    },
    1: {
        id: 1,
        name: "Tic Tac Toe",
        playerCount: 2,
        isMultiplayer: true,
        description: `
  Tic Tac Toe is a puzzle game for two players, called 'X' and 'O', who take turns marking the spaces in a 3 × 3 grid. vertically or diagonally, you win the game.`,
    },
    2: {
        id: 2,
        name: "Rock Paper Scissors",
        playerCount: 2,
        isMultiplayer: true,
        description: "Rock, Paper, Scissors is a simple hand game played between two people. The game consists of three possible moves: rock, paper, or scissors. The objective is to select a move that defeats the move chosen by the opponent.",
    },
    3: {
        id: 3,
        name: "Simon Says",
        playerCount: 1,
        isMultiplayer: false,
        description: ` Simon Says is a classic children's game that involves following instructions given by a leader, who is typically referred to as "Simon." The goal of the game is to correctly perform the actions instructed by Simon while paying careful attention to whether or not Simon precedes the command with the phrase "Simon says."`,
    },
};
const getGameData = (gameIdOrName) => {
    if (typeof gameIdOrName === "number") {
        if (gameIdOrName > Object.keys(exports.games).length || gameIdOrName < 0) {
            throw new Error("game not found");
        }
        return exports.games[gameIdOrName];
    }
    const game = Object.values(exports.games).find((game) => game.name === gameIdOrName);
    if (game)
        return game;
    else
        throw new Error("Game not found");
};
exports.getGameData = getGameData;
