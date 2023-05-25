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
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameHandlerConnection = void 0;
const users_1 = require("../../../shared/types/users");
const gameHandlers_1 = require("../../../shared/handlers/gameHandlers");
const room_1 = require("../../../shared/handlers/room");
const usersHandler_1 = require("../../../shared/handlers/usersHandler");
const server_1 = require("../server");
const gameHandlerConnection = (io, socket) => {
    var _a;
    console.log("connected");
    // TODO:change it to be in socket.data
    const gameStr = socket.handshake.auth;
    var room = room_1.roomHandler.getRoom((0, server_1.getRoomId)(socket));
    // console.log(roomHandler);
    // if (!room) {
    //   const Games = getGame(gameStr["gameName"] as GameNames);
    //   if (!Games) return;
    //   room = roomHandler.createRoom<GameRoom>(
    //     getRoomId(socket),
    //     new GameRoom(getRoomId(socket), Games)
    //   );
    // }
    var game;
    if ((_a = room === null || room === void 0 ? void 0 : room.match) === null || _a === void 0 ? void 0 : _a.game) {
        game = room.match.game;
    }
    const connInfo = {
        roomId: socket.handshake.auth["roomId"],
        user: Object.assign(Object.assign({}, socket.handshake.auth["user"]), { socketId: socket.id }),
    };
    // console.log(socket.handshake.auth["user"]);
    socket.on("join_room", (roomId) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        try {
            room_1.roomHandler.addUserToRoom(roomId, connInfo.user);
        }
        catch (e) {
            const Games = (0, gameHandlers_1.getGame)(gameStr["gameName"]);
            if (!Games)
                return;
            room = room_1.roomHandler.createRoom((0, server_1.getRoomId)(socket), new room_1.GameRoom((0, server_1.getRoomId)(socket), Games));
            room_1.roomHandler.addUserToRoom(roomId, connInfo.user);
        }
        // console.log(room);
        socket.join(roomId);
        const hasRoom = room_1.roomHandler.getRoom((0, server_1.getRoomId)(socket));
        if (hasRoom) {
            room = hasRoom;
        }
        if ((_b = room === null || room === void 0 ? void 0 : room.match) === null || _b === void 0 ? void 0 : _b.game) {
            game = room.match.game;
        }
        room === null || room === void 0 ? void 0 : room.match.addPlayer(connInfo.user);
        io.to(roomId).emit("get_players", game.getPlayers());
    }));
    socket.on("get_state", (callback) => {
        callback(game.getState());
    });
    socket.on("player_ready", () => {
        // if (game?.isReady()) {
        const roomId = (0, server_1.getRoomId)(socket);
        io.to(roomId).emit("start_game");
        room.users.getUsers().forEach((user) => {
            usersHandler_1.uhandler.updateUser(user.id, {
                game: {
                    state: users_1.UserGameState.playing,
                    gameId: roomId,
                },
            });
        });
        room === null || room === void 0 ? void 0 : room.match.playGame(io, socket, game);
        // }
    });
    socket.on("rematch", (_) => {
        // check if other player has rematched
        console.log((room === null || room === void 0 ? void 0 : room.match.players.getPlayer(connInfo.user.id).state) ==
            gameHandlers_1.MatchPlayerState.playing);
        room === null || room === void 0 ? void 0 : room.match.changePlayerState(connInfo.user.id, gameHandlers_1.MatchPlayerState.waiting_rematch);
        console.log(room === null || room === void 0 ? void 0 : room.match.canRematch());
        if (room === null || room === void 0 ? void 0 : room.match.canRematch()) {
            console.log("rematchh");
            const state = room === null || room === void 0 ? void 0 : room.match.rematch();
            io.to((0, server_1.getRoomId)(socket)).emit("rematch_accept", state);
        }
        else {
            socket.broadcast.to((0, server_1.getRoomId)(socket)).emit("rematch");
        }
    });
    socket.on("disconnecting", () => {
        const roomId = (0, server_1.getRoomId)(socket);
        io.in(roomId).emit("user_disconnected", roomId);
        io.in(roomId).socketsLeave(roomId);
        room_1.roomHandler.deleteRoom(roomId);
    });
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
};
exports.gameHandlerConnection = gameHandlerConnection;
