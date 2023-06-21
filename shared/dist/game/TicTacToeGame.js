"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicTacToeGame = exports.checkLine = exports.checkBoard = exports.newBlock = exports.isValid = exports.generateBoard = exports.TicTacToeBoard = void 0;
const RoundHandler_1 = require("../handlers/RoundHandler");
const usersHandler_1 = require("../handlers/usersHandler");
const game_1 = require("../types/game");
class TicTacToeBoard extends game_1.Board {
    constructor() {
        super();
        this.board = [];
        this.addMove = (move) => {
            const p = this.board[move.coords.x];
            if (!p)
                return;
            if ((0, exports.isValid)(this.board, move.coords.x, move.coords.y)) {
                p[move.coords.y] = move;
                this.moves.push(move);
            }
            return this.board;
        };
        this.generateBoard = () => {
            let rows = [];
            for (let i = 0; i < 3; i++) {
                rows[i] = new Array(3).fill({
                    id: "",
                    choice: null,
                    coords: {
                        x: 0,
                        y: 0,
                    },
                });
            }
            return rows;
        };
        this.isValid = (board, x = -1, y = -1) => {
            var _a;
            if (!board)
                return false;
            if (x < 0 || x > board.length || y < 0 || y > board.length) {
                return false;
            }
            const pos = board[x];
            if (!pos)
                return false;
            if ((_a = pos[y]) === null || _a === void 0 ? void 0 : _a.choice) {
                return false;
            }
            if (this.checkBoard(board).winner)
                return false;
            return true;
        };
        this.newBlock = (params) => {
            return {
                id: params.id,
                choice: params.choice,
                coords: {
                    x: params === null || params === void 0 ? void 0 : params.coords.x,
                    y: params === null || params === void 0 ? void 0 : params.coords.y,
                },
            };
        };
        this.checkBoard = (board) => {
            var _a;
            let winner = {
                winner: null,
                board: null,
                loser: null,
                isTie: false,
            };
            if (!board)
                return winner;
            for (let i = 0; i < board.length; i++) {
                const line = this.checkLine(board[i]);
                // console.log(line);
                if (line) {
                    if (board[i][0].id)
                        winner.winner = board[i][0].id;
                    winner.board = board[i];
                }
                let col = board.map((row) => row[i]);
                const initialChoice = (_a = col[0]) === null || _a === void 0 ? void 0 : _a.choice;
                if (initialChoice &&
                    col.every((item) => item.choice == initialChoice)) {
                    winner.winner = col[0].id;
                    winner.board = col;
                }
            }
            let diag1 = board.map((row, index) => row[index]);
            if (this.checkLine(diag1)) {
                winner.winner = diag1[0].id;
                winner.board = diag1;
            }
            let diag2 = board.map((row, index) => row[board.length - index - 1]);
            if (this.checkLine(diag2)) {
                winner.winner = diag2[0].id;
                winner.board = diag2;
            }
            let isFull = true;
            for (let i = 0; i < board.length; i++) {
                const elem = board[i];
                for (let j = 0; j < elem.length; j++) {
                    if (!board[i][j].choice) {
                        isFull = false;
                    }
                }
            }
            if (isFull == true && !winner.winner) {
                winner.isTie = true;
                winner.winner = "tie";
            }
            return winner;
        };
        this.checkLine = (diagonal) => {
            var _a, _b;
            if (diagonal.length === 0)
                return false;
            for (let i = 0; i < diagonal.length; i++) {
                if (((_a = diagonal[i]) === null || _a === void 0 ? void 0 : _a.choice) !== ((_b = diagonal[0]) === null || _b === void 0 ? void 0 : _b.choice)) {
                    return false;
                }
            }
            return true;
        };
        this.moves = [];
        this.board = this.generateBoard();
    }
}
exports.TicTacToeBoard = TicTacToeBoard;
_a = new TicTacToeBoard(), exports.generateBoard = _a.generateBoard, exports.isValid = _a.isValid, exports.newBlock = _a.newBlock, exports.checkBoard = _a.checkBoard, exports.checkLine = _a.checkLine;
class TicTacToeGame extends game_1.Game {
    constructor() {
        super(...arguments);
        this.name = "Tic Tac Toe";
        this.players = new usersHandler_1.PlayerHandler();
        this.board = new TicTacToeBoard();
        this.rounds = new RoundHandler_1.RoundHandler();
    }
    isPlayerTurn(playerId) {
        if (this.board.moves.length == 0) {
            const player = this.players
                .getPlayers()
                .filter((i) => i.choice == "X");
            if (player.length == 0 || !player[0])
                return false;
            return player[0].id == playerId;
        }
        const p = this.board.moves[this.board.moves.length - 1];
        if (!p)
            return false;
        return p.id !== playerId;
    }
    playerTurn() {
        if (this.board.moves.length == 0) {
            return this.players.getPlayers().find((i) => i.choice == "X");
        }
        return this.board.moves[this.board.moves.length - 1];
    }
    isReady() {
        return true;
    }
    addPlayer(player) {
        var _a, _b;
        let choice;
        if (this.players.getPlayers().length == 0) {
            choice = Math.random() > 0.5 ? "X" : "O";
        }
        else if (((_a = this.players.getPlayers()[0]) === null || _a === void 0 ? void 0 : _a.choice) == "O" ||
            ((_b = this.players.getPlayers()[0]) === null || _b === void 0 ? void 0 : _b.choice) == "X") {
            choice = this.players.getPlayers()[0].choice == "X" ? "O" : "X";
        }
        this.players.addPlayer(Object.assign(Object.assign({}, player), { choice: choice }));
    }
    newRound() {
        if (this.board.moves.length > 0) {
            const winner = this.board.checkBoard(this.board.board);
            this.rounds.addRound({
                winner: {
                    id: winner.isTie ? "tie" : winner.winner,
                },
                isTie: winner.isTie,
                moves: {
                    isTie: winner.isTie,
                    moves: this.board.moves,
                    loser: {
                        id: winner.loser ? winner.loser : "",
                    },
                    winner: {
                        id: winner.winner ? winner.winner : "",
                    },
                },
            });
        }
        this.board.board = this.board.generateBoard();
        this.players.getPlayers().forEach((player) => {
            player.choice = player.choice == "X" ? "O" : "X";
        });
        this.board.moves = [];
    }
    getPlayers() {
        return this.players.getPlayers();
    }
    play(move) {
        this.board.addMove(move);
        // console.log(this.board.board);
    }
    hasWinner() {
        return this.board.isValid;
    }
    hasGameWinner() {
        return this.rounds.hasGameWinner();
    }
    getState() {
        return {
            board: this.board.board,
            currentPlayerTurn: this.playerTurn(),
            moves: this.board.moves,
            name: this.name,
            players: this.players.getPlayers(),
            rounds: {
                count: this.rounds.count,
                rounds: this.rounds.rounds,
            },
        };
    }
}
exports.TicTacToeGame = TicTacToeGame;
