"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBoard = exports.CFGame = exports.CFBoard = void 0;
const game_1 = require("../types/game");
const usersHandler_1 = require("../handlers/usersHandler");
const RoundHandler_1 = require("../handlers/RoundHandler");
class CFBoard extends game_1.Board {
    constructor() {
        super();
        this.moves = [];
        this.rows = 7;
        this.cols = 6;
        this.board = this.generateBoard();
    }
    generateBoard() {
        let rows = [];
        for (let i = 0; i < this.rows; i++) {
            rows[i] = new Array(this.cols).fill({
                id: "",
                move: {
                    color: [0, 0, 0],
                    coords: {
                        x: 0,
                        y: 0,
                    },
                },
            });
        }
        return rows;
    }
    addMove(move) {
        var _a;
        if (!this.isValid(this.board, move.coords.x, move.coords.y))
            return;
        for (let i = this.rows - 1; i >= 0; i--) {
            const board = this.board;
            const pos = board[i];
            if (!pos)
                continue;
            if (!((_a = pos[move.coords.x]) === null || _a === void 0 ? void 0 : _a.id)) {
                const nmove = {
                    id: move.id,
                    color: move.color,
                    coords: {
                        x: move.coords.x,
                        y: i,
                    },
                };
                pos[move.coords.x] = nmove;
                this.moves.push(nmove);
                // console.log(this.board);
                break;
            }
        }
        // console.log(this.board);
    }
    checkBoard() {
        var _a, _b, _c, _d;
        for (let j = 0; j < this.rows; j++) {
            for (let i = 0; i <= this.cols - 4; i++) {
                const test = this.board[j][i];
                if (test.id) {
                    let temp = true;
                    for (let k = 0; k < 4; k++) {
                        if (((_a = this.board[j][i + k]) === null || _a === void 0 ? void 0 : _a.id) !== test.id) {
                            temp = false;
                        }
                    }
                    if (temp == true) {
                        return true;
                    }
                }
            }
        }
        for (let j = 0; j <= this.rows - 4; j++) {
            for (let i = 0; i < this.cols; i++) {
                const test = this.board[j][i];
                if (!test)
                    return false;
                if (test.id) {
                    let temp = true;
                    for (let k = 0; k < 4; k++) {
                        if (((_b = this.board[j + k][i]) === null || _b === void 0 ? void 0 : _b.id) !== test.id) {
                            temp = false;
                        }
                    }
                    if (temp == true) {
                        return true;
                    }
                }
            }
            for (let i = 0; i < this.cols - 4; i++) {
                const test = this.board[j][i];
                if (!test)
                    continue;
                if (test.id) {
                    let temp = true;
                    for (let k = 0; k < 4; k++) {
                        if (((_c = this.board[j + k][i + k]) === null || _c === void 0 ? void 0 : _c.id) !== test.id) {
                            temp = false;
                        }
                    }
                    if (temp == true) {
                        return true;
                    }
                }
            }
            for (let i = 3; i < this.cols; i++) {
                const test = this.board[j][i];
                if (!test)
                    continue;
                if (test.id) {
                    let temp = true;
                    for (let k = 0; k < 4; k++) {
                        if (((_d = this.board[j + k][i - k]) === null || _d === void 0 ? void 0 : _d.id) !== test.id) {
                            return true;
                        }
                    }
                    if (temp == true) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    isTie() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (!this.board[i][j].id)
                    return false;
            }
        }
        return true;
    }
    isValid(board, x, y) {
        if (!board)
            return false;
        if (x < 0 || x > board[0].length || y < 0 || y > board.length) {
            return false;
        }
        console.log(board.length, board[0].length, x);
        const pos = board[y][x];
        if (!pos)
            return false;
        if (board[x][y].id)
            return false;
        return true;
    }
}
exports.CFBoard = CFBoard;
class CFGame extends game_1.Game {
    addPlayer(player) {
        const choice = this.players.getPlayers().length == 1 ? "red" : "blue";
        this.players.addPlayer({
            id: player.id,
            choice,
        });
    }
    getPlayers() {
        return this.players.getPlayers();
    }
    isReady() {
        return this.getPlayers().length == 2;
    }
    constructor() {
        super();
        this.name = "connect Four";
        this.rounds = new RoundHandler_1.RoundHandler();
        this.moves = [];
        this.players = new usersHandler_1.PlayerHandler();
        this.board = new CFBoard();
    }
    getState() {
        let playerWins = {};
        for (const p of this.players.getPlayers()) {
            playerWins[p.id] = this.rounds.countWins(p.id);
        }
        return {
            board: this.board.board,
            currentPlayerTurn: this.players.getPlayers()[0],
            moves: this.board.moves,
            name: this.name,
            players: this.players.getPlayers(),
            rounds: {
                count: this.rounds.count,
                rounds: this.rounds.rounds,
                wins: Object.assign(Object.assign({}, playerWins), { ties: this.rounds.rounds.filter((i) => i.isTie).length }),
            },
        };
    }
    newRound() {
        if (this.moves.length == 0)
            return;
        let w = {
            id: "",
        };
        let wi = this.getWinner();
        if (wi === null || wi === void 0 ? void 0 : wi.winner) {
            w.id = wi.winner.id;
        }
        this.rounds.addRound({
            isTie: false,
            winner: w,
            moves: {
                moves: this.moves,
            },
        });
        this.moves = [];
        this.board = new CFBoard();
    }
    isPlayerTurn(playerId) {
        if (this.moves.length == 0) {
            return this.players.getPlayers()[0].id == playerId;
        }
        return this.moves[this.moves.length - 1].id !== playerId;
    }
    playerTurn() {
        if (this.board.moves.length == 0) {
            return this.players.getPlayers().find((i) => i.choice == "blue");
        }
        return this.board.moves[this.board.moves.length - 1];
    }
    getWinner() {
        const hasWin = this.board.checkBoard();
        if (!hasWin)
            return null;
        const winner = this.moves[this.moves.length - 1];
        return {
            isTie: false,
            winner: winner,
            moves: {
                moves: this.moves,
            },
        };
    }
    play(move) {
        // console.log(this.moves);
        this.board.addMove(move);
        this.moves.push(move);
    }
}
exports.CFGame = CFGame;
exports.generateBoard = new CFBoard().generateBoard;
