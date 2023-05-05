"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const http_1 = __importDefault(require("http"));
const server = http_1.default.createServer(app);
const socket_io_1 = require("socket.io");
const room_1 = require("./room");
exports.io = new socket_io_1.Server(server);
const r = new room_1.RoomHandler();
const getRoomId = (socket) => socket.handshake.auth["roomId"];
exports.io.on("connection", (socket) => {
    const gameStr = socket.handshake.auth;
    var room = r.getRoom(getRoomId(socket));
    var game = room === null || room === void 0 ? void 0 : room.game;
    console.log("user connected");
    const handshakeInfo = {
        roomId: gameStr["roomId"],
        user: gameStr["user"],
    };
    handshakeInfo.user.socketId = socket.id;
    socket.on("join_room", (roomId) => __awaiter(void 0, void 0, void 0, function* () {
        r.addUserToRoom(roomId, handshakeInfo.user);
        socket.join(roomId);
        room = r.getRoom(getRoomId(socket));
        game = room === null || room === void 0 ? void 0 : room.game;
        game === null || game === void 0 ? void 0 : game.addPlayer(Object.assign({}, handshakeInfo.user));
        // console.log(r.getRoom(roomId))
        exports.io.to(roomId).emit("user_connected", roomId);
        if ((game === null || game === void 0 ? void 0 : game.getPlayers().length) == 2) {
            exports.io.to(roomId).emit("start_game", game === null || game === void 0 ? void 0 : game.getPlayers());
        }
    }));
    // player move
    socket.on("choice", (player) => {
        if (!player.choice)
            return;
        game === null || game === void 0 ? void 0 : game.play({
            choice: player.choice,
            id: player.id,
        }, player.choice);
        const roundWinner = game === null || game === void 0 ? void 0 : game.hasRoundWinner();
        if (roundWinner) {
            exports.io.to(getRoomId(socket)).emit("round_winner", roundWinner);
            game === null || game === void 0 ? void 0 : game.newRound();
            if (game === null || game === void 0 ? void 0 : game.hasGameWinner()) {
                exports.io.to(getRoomId(socket)).emit("game_winner", game.hasGameWinner());
            }
            setTimeout(() => {
                exports.io.to(getRoomId(socket)).emit("new_round");
            }, 10);
        }
        exports.io.to(getRoomId(socket)).emit("choice", {
            id: player.id,
            choice: player.choice,
        });
        // console.log(r.rooms)
    });
    socket.on("disconnect", () => {
        exports.io.in(getRoomId(socket)).emit("user_disconnected", getRoomId(socket));
        r.rooms.delete(getRoomId(socket));
        exports.io.in(getRoomId(socket)).socketsLeave(getRoomId(socket));
        console.log("user disconnected");
    });
});
server.listen(3001, () => {
    console.log("listening on *:3001");
});
