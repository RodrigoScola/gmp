"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gamequeueHandlerConnection = void 0;
const gameHandlers_1 = require("../../../shared/handlers/gameHandlers");
const room_1 = require("../../../shared/handlers/room");
const usersHandler_1 = require("../../../shared/handlers/usersHandler");
const matchQueue_1 = require("../matchQueue");
const server_1 = require("../server");
const gamequeueHandlerConnection = (gamequeueHandler, socket) => {
    const connInfo = {
        roomId: socket.handshake.auth["roomId"],
        user: Object.assign(Object.assign({}, socket.handshake.auth["user"]), { socketId: socket.id }),
    };
    socket.on("join_queue", (games) => {
        var _a;
        if (!room_1.roomHandler.roomExists("queueroom")) {
            room_1.roomHandler.createRoom("queueroom", new room_1.QueueRoom("queueroom"));
        }
        const room = room_1.roomHandler.getRoom("queueroom");
        if (!room) {
            return;
        }
        let user = usersHandler_1.uhandler.getUser((_a = (0, server_1.getUserFromSocket)(socket)) === null || _a === void 0 ? void 0 : _a.id);
        if (!user) {
            user = usersHandler_1.uhandler.addUser(connInfo.user);
        }
        room.addUser({
            games: games,
            id: user.id,
            socketId: connInfo.user.socketId,
        });
        matchQueue_1.gameQueue.addPlayer({
            games: games,
            id: user.id,
        });
        if (!user)
            return;
        const match = matchQueue_1.gameQueue.findMatch(user.id);
        if (!match)
            return;
        const players = matchQueue_1.gameQueue.matchPlayer(match);
        if (players) {
            const gameRoom = room_1.roomHandler.createRoom(server_1.gameId, new room_1.GameRoom(server_1.gameId, (0, gameHandlers_1.getGame)(match.gameName)));
            players.forEach((player) => {
                const user = usersHandler_1.uhandler.getUser(player.id);
                if (!user)
                    return;
                gameRoom.addUser(user);
                const roomUser = room.users.getUser(player.id);
                if (!roomUser)
                    return;
                gamequeueHandler.to(roomUser === null || roomUser === void 0 ? void 0 : roomUser.socketId).emit("game_found", server_1.gameId);
                matchQueue_1.gameQueue.removePlayer(player);
                room.users.deleteUser(user === null || user === void 0 ? void 0 : user.id);
            });
        }
    });
    socket.on("disconnect", () => {
        matchQueue_1.gameQueue.removePlayer(connInfo.user.id);
    });
};
exports.gamequeueHandlerConnection = gamequeueHandlerConnection;
