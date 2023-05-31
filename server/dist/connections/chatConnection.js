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
const room_1 = require("../../../shared/src/handlers/room");
const users_1 = require("../../../shared/src/types/users");
const usersHandler_1 = require("../../../shared/src/handlers/usersHandler");
const ConversationHandler_1 = require("../../../shared/src/handlers/ConversationHandler");
const db_1 = require("../../../shared/src/db");
const chatHandlerConnection = (chatHandler, socket) => {
    var room;
    socket.on("join_room", (roomId) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        console.log(room_1.roomHandler);
        const connInfo = {
            roomId: (_a = socket.handshake.auth["roomId"]) !== null && _a !== void 0 ? _a : roomId.toString(),
            user: Object.assign(Object.assign({}, socket.handshake.auth["user"]), { socketId: socket.id }),
        };
        try {
            room_1.roomHandler.addUserToRoom(roomId, {
                id: connInfo.user.id,
                state: users_1.UserState.online,
                socketId: connInfo.user.socketId,
            });
            room = room_1.roomHandler.getRoom(roomId);
        }
        catch (e) {
            room = room_1.roomHandler.createRoom(connInfo.roomId, new room_1.ChatRoom(roomId));
            console.log(room_1.roomHandler);
            yield room.getConversation(roomId);
            room_1.roomHandler.addUserToRoom(roomId, {
                id: connInfo.user.id,
                state: users_1.UserState.online,
                socketId: connInfo.user.socketId,
            });
            socket.data.roomId = roomId;
            room = room_1.roomHandler.getRoom((0, server_1.getRoomId)(socket));
        }
        if (room) {
            chatHandler
                .to(roomId)
                .emit("user_joined", room.users.getUsers());
        }
        socket.join(roomId);
        const hasRoom = room_1.roomHandler.getRoom((0, server_1.getRoomId)(socket));
        if (hasRoom) {
            room = hasRoom;
        }
    }));
    socket.on("find_conversation", (user1Id, user2Id, callback) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        let d = yield db_1.db
            .rpc("find_conversation", {
            user1_id: user1Id,
            user2_id: user2Id,
        })
            .single();
        let nconversationId = (_b = d.data) === null || _b === void 0 ? void 0 : _b.id;
        if (!nconversationId) {
            const { data: nconv } = yield db_1.db
                .from("conversations")
                .insert({
                user1: user1Id,
                user2: user2Id,
            })
                .select("*")
                .single();
            nconversationId = nconv === null || nconv === void 0 ? void 0 : nconv.id;
        }
        socket.data.roomId = nconversationId.toString();
        callback({
            id: nconversationId,
            users: [{ id: user1Id }, { id: user2Id }],
            messages: [],
        });
    }));
    socket.on("state_change", (state) => {
        var _a;
        if (!room && socket.data.roomId) {
            room = room_1.roomHandler.getRoom(socket.data.roomId);
        }
        if (!(room === null || room === void 0 ? void 0 : room.users))
            return;
        room.users.updateUser((_a = (0, server_1.getUserFromSocket)(socket)) === null || _a === void 0 ? void 0 : _a.id, {
            state,
        });
        socket.broadcast.to((0, server_1.getRoomId)(socket)).emit("state_change", {
            id: room.id,
            users: room.users.getUsers(),
        });
    });
    socket.on("send_message", (message, callback) => __awaiter(void 0, void 0, void 0, function* () {
        var _c, _d;
        const roomId = (_d = (_c = socket.data.roomId) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : socket.handshake.auth["roomId"];
        if (roomId) {
            room = room_1.roomHandler.getRoom(roomId);
        }
        console.log(roomId, "this is the room id");
        console.log(room, "this is the room");
        console.log(room_1.roomHandler.getRoom(roomId));
        if (!room && roomId) {
            const tempRoom = (0, room_1.getRoom)(roomId);
            if (!tempRoom) {
                room = room_1.roomHandler.createRoom(roomId, new room_1.ChatRoom(roomId));
            }
        }
        yield room.getConversation(roomId);
        const nmessage = (0, ConversationHandler_1.newMessage)(message.userId, message.message);
        const conversationUsers = room.messages.users;
        const users = room.users.getUsers();
        conversationUsers.forEach((user) => {
            var _a;
            const muser = usersHandler_1.uhandler.getUser(user.id);
            const inChannel = room.users.users.has(user.id);
            if (!inChannel && muser && user.id !== message.userId) {
                server_1.userHandler
                    .to(muser.socketId)
                    .emit("notification_message", {
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
