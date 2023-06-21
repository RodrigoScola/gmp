"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGame = exports.MatchHandler = exports.MatchPlayerState = exports.getRoomId = void 0;
const TicTacToeGame_1 = require("../game/TicTacToeGame");
const c4Game_1 = require("../game/c4Game");
const rockpaperScissors_1 = require("../game/rockpaperScissors");
const simonSays_1 = require("../game/simonSays");
const room_1 = require("./room");
const usersHandler_1 = require("./usersHandler");
const getRoomId = (socket) => socket.handshake.auth["roomId"];
exports.getRoomId = getRoomId;
const handleSimonSaysGame = (_, socket, game
// room: Room
) => {
    socket.on("sms_move", (move) => {
        game.play(move);
        if (game.hasLost) {
            // handle loss
            socket.emit("sms_game_lost");
        }
        if (game.sequenceComplete()) {
            // handle new round
            game.newRound();
            socket.emit("sms_new_round", game.getState());
        }
    });
};
const handleConnectGame = (io, socket, game, _) => {
    socket.on("c_player_move", (move) => {
        io.to((0, exports.getRoomId)(socket)).emit("c_player_move", move);
    });
    socket.on("connect_choice", (move) => {
        console.log("connect choice");
        if (game.isPlayerTurn(move.id)) {
            game.play(move);
            io.to((0, exports.getRoomId)(socket)).emit("connect_choice", {
                board: game.board,
                move: move,
            });
            const winner = game.getWinner();
            if (winner) {
                io.to((0, exports.getRoomId)(socket)).emit("connect_game_winner", winner);
                console.log(winner);
                setTimeout(() => {
                    io.to((0, exports.getRoomId)(socket)).emit("new_round");
                    game.newRound();
                }, 1000);
            }
        }
    });
};
const handleTTCGame = (io, socket, game
// room: Room
) => {
    socket.on("ttc_choice", ({ move }) => {
        console.log(game.isPlayerTurn(move.id));
        if (game.isPlayerTurn(move.id)) {
            game.play(move);
            io.to((0, exports.getRoomId)(socket)).emit("ttc_choice", {
                board: game.board.board,
                move: move,
            });
        }
        const winner = game.board.checkBoard(game.board.board);
        if (winner.winner) {
            io.to((0, exports.getRoomId)(socket)).emit("ttc_game_winner", winner);
            setTimeout(() => {
                game.newRound();
                io.to((0, exports.getRoomId)(socket)).emit("new_round");
            }, 1000);
        }
    });
    socket.on("get_state", (callback) => {
        callback(game.getState());
    });
};
const handleRpsGame = (io, socket, game
// room: Room
) => {
    // player move
    socket.on("rps_choice", (player) => {
        var _a, _b, _c, _d;
        console.log(player);
        game === null || game === void 0 ? void 0 : game.play({
            choice: player.choice,
            id: player.id,
        }, player.choice);
        const roundWinner = game === null || game === void 0 ? void 0 : game.hasRoundWinner();
        if (roundWinner) {
            console.table(roundWinner);
            io.to((0, exports.getRoomId)(socket)).emit("round_winner", roundWinner);
            game === null || game === void 0 ? void 0 : game.newRound();
            const gameWinner = game === null || game === void 0 ? void 0 : game.hasGameWin();
            if (gameWinner) {
                console.table(gameWinner);
                const winner = (_a = usersHandler_1.uhandler.getUser(gameWinner.id)) === null || _a === void 0 ? void 0 : _a.user;
                if (winner) {
                    io.to((0, exports.getRoomId)(socket)).emit("rps_game_winner", {
                        id: winner.id,
                        created_at: (_b = winner.created_at) !== null && _b !== void 0 ? _b : "",
                        username: (_c = winner.username) !== null && _c !== void 0 ? _c : "",
                        email: (_d = winner.email) !== null && _d !== void 0 ? _d : "",
                    });
                }
            }
            else {
                setTimeout(() => {
                    io.to((0, exports.getRoomId)(socket)).emit("new_round");
                }, 2000);
            }
        }
        io.to((0, exports.getRoomId)(socket)).emit("rps_choice", {
            id: player.id,
            choice: player.choice,
        });
    });
};
var MatchPlayerState;
(function (MatchPlayerState) {
    MatchPlayerState[MatchPlayerState["playing"] = 0] = "playing";
    MatchPlayerState[MatchPlayerState["waiting_rematch"] = 1] = "waiting_rematch";
})(MatchPlayerState = exports.MatchPlayerState || (exports.MatchPlayerState = {}));
class MatchHandler {
    constructor(game) {
        this.players = new usersHandler_1.PlayerHandler();
        this.game = game;
    }
    addPlayer(player) {
        this.players.addPlayer({
            id: player.id,
            state: MatchPlayerState.playing,
        });
        this.game.addPlayer(player);
    }
    changePlayerState(playerId, state) {
        const player = this.players.getPlayer(playerId);
        if (!player)
            return null;
        player.state = state;
        return player;
    }
    canRematch() {
        return this.players
            .getPlayers()
            .every((i) => i.state === MatchPlayerState.waiting_rematch);
    }
    getGameHandler(gamename) {
        switch (gamename) {
            case "Rock Paper Scissors":
                return handleRpsGame;
            case "Tic Tac Toe":
                return handleTTCGame;
            case "connect Four":
                return handleConnectGame;
            case "Simon Says":
                return handleSimonSaysGame;
        }
    }
    getGame(gameName) {
        return (0, exports.getGame)(gameName);
    }
    rematch() {
        saveGame(this.game);
        const players = this.game.getPlayers();
        const g = this.getGame(this.game.name);
        if (g) {
            for (const player of players) {
                g.addPlayer(player);
            }
            this.game = g;
        }
        this.players.getPlayers().forEach((player) => {
            this.changePlayerState(player.id, MatchPlayerState.playing);
        });
        return this.game;
    }
    newGame(gameName) {
        const game = (0, exports.getGame)(gameName);
        if (!game)
            return;
        saveGame(this.game);
        this.game = game;
    }
    playGame(io, socket, game) {
        const handler = this.getGameHandler(game.name);
        if (!handler)
            return;
        const room = (0, room_1.getRoom)((0, exports.getRoomId)(socket));
        if (!room)
            return;
        handler(io, socket, game, room);
    }
}
exports.MatchHandler = MatchHandler;
const saveGame = (_) => { };
const getGame = (gameName) => {
    switch (gameName) {
        case "Tic Tac Toe":
            return new TicTacToeGame_1.TicTacToeGame();
        case "Rock Paper Scissors":
            return new rockpaperScissors_1.RockPaperScissorsGame();
        case "connect Four":
            return new c4Game_1.CFGame();
        case "Simon Says":
            return new simonSays_1.SimonSaysGame();
    }
};
exports.getGame = getGame;
