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
exports.chatHandlerConnection = void 0;
const server_1 = require("../server");
const room_1 = require("../../../shared/handlers/room");
const users_1 = require("../../../shared/types/users");
const usersHandler_1 = require("../../../shared/handlers/usersHandler");
const ConversationHandler_1 = require("../../../shared/handlers/ConversationHandler");
const chatHandlerConnection = (chatHandler, socket) => {
    var room;
    socket.on("join_room", (roomId) => __awaiter(void 0, void 0, void 0, function* () {
        const connInfo = {
            roomId: socket.handshake.auth["roomId"],
            user: Object.assign(Object.assign({}, socket.handshake.auth["user"]), { socketId: socket.id }),
        };
        try {
            room_1.roomHandler.addUserToRoom(roomId, {
                id: connInfo.user.id,
                state: users_1.UserState.online,
                socketId: connInfo.user.socketId,
            });
            room = room_1.roomHandler.getRoom((0, server_1.getRoomId)(socket));
        }
        catch (e) {
            room = room_1.roomHandler.createRoom((0, server_1.getRoomId)(socket), new room_1.ChatRoom((0, server_1.getRoomId)(socket)));
            yield room.getConversation();
            room_1.roomHandler.addUserToRoom(roomId, {
                id: connInfo.user.id,
                state: users_1.UserState.online,
                socketId: connInfo.user.socketId,
            });
            socket.data.roomId = roomId;
            room = room_1.roomHandler.getRoom((0, server_1.getRoomId)(socket));
        }
        if (room) {
            chatHandler.to(roomId).emit("user_joined", room.users.getUsers());
        }
        socket.join(roomId);
        const hasRoom = room_1.roomHandler.getRoom((0, server_1.getRoomId)(socket));
        if (hasRoom) {
            room = hasRoom;
        }
    }));
    socket.on("state_change", (state) => {
        var _a, _b;
        if (!room && socket.data.roomId) {
            room = room_1.roomHandler.getRoom(socket.data.roomId);
        }
        if (!(room === null || room === void 0 ? void 0 : room.users))
            return;
        room.users.updateUser((_a = (0, server_1.getUserFromSocket)(socket)) === null || _a === void 0 ? void 0 : _a.id, {
            state,
        });
        const userFromSocket = room.users.getUser((_b = (0, server_1.getUserFromSocket)(socket)) === null || _b === void 0 ? void 0 : _b.id);
        if (userFromSocket) {
            socket.broadcast
                .to((0, server_1.getRoomId)(socket))
                .emit("state_change", userFromSocket);
        }
    });
    socket.on("send_message", (message, callback) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const roomId = (_a = socket.data.roomId) !== null && _a !== void 0 ? _a : socket.handshake.auth["roomId"];
        if (socket.data.roomId) {
            room = room_1.roomHandler.getRoom(socket.data.roomId);
        }
        if (!room && roomId) {
            const tempRoom = (0, room_1.getRoom)(roomId);
            if (!tempRoom) {
                room = room_1.roomHandler.createRoom(roomId, new room_1.ChatRoom(roomId));
            }
        }
        yield room.getConversation();
        const nmessage = (0, ConversationHandler_1.newMessage)(message.userId, message.message);
        const conversationUsers = room.messages.users;
        const users = room.users.getUsers();
        conversationUsers.forEach((user) => {
            var _a;
            const muser = usersHandler_1.uhandler.getUser(user.id);
            const inChannel = room.users.users.has(user.id);
            if (!inChannel && muser) {
                server_1.userHandler.to(muser.socketId).emit("notification_message", {
                    user: (_a = usersHandler_1.uhandler.getUser(message.userId)) === null || _a === void 0 ? void 0 : _a.user,
                });
            }
        });
        users.forEach((user) => {
            chatHandler.to(user.socketId).emit("receive_message", nmessage);
            // console.log(user.socketId);
        });
        yield room.messages.addMessage(nmessage);
        if (callback) {
            callback({
                received: true,
            });
        }
    }));
    socket.on("disconnecting", () => {
        var _a;
        if (room) {
            room.users.deleteUser((_a = (0, server_1.getUserFromSocket)(socket)) === null || _a === void 0 ? void 0 : _a.id);
        }
    });
};
exports.chatHandlerConnection = chatHandlerConnection;
