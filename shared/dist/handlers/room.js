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
exports.GameRoom = exports.QueueRoom = exports.ChatRoom = exports.Room = exports.getRoom = exports.roomHandler = exports.RoomHandler = void 0;
const gameHandlers_1 = require("./gameHandlers");
const rockpaperScissors_1 = require("../game/rockpaperScissors");
const usersHandler_1 = require("./usersHandler");
const ConversationHandler_1 = require("./ConversationHandler");
const matchQueue_1 = require("./matchQueue");
const users_1 = require("../types/users");
class RoomHandler {
    constructor() {
        this.rooms = new Map();
    }
    roomExists(roomId) {
        return this.rooms.has(roomId);
    }
    createRoom(roomId, room) {
        if (!this.roomExists(roomId)) {
            this.rooms.set(roomId, room);
        }
        return this.rooms.get(roomId);
    }
    getRoom(roomId) {
        if (!this.rooms.has(roomId))
            return;
        return this.rooms.get(roomId);
    }
    deleteRoom(roomId) {
        if (!this.roomExists(roomId))
            return;
        const room = this.rooms.get(roomId);
        if (!room)
            return;
        room.delete();
        this.rooms.delete(roomId);
    }
    addUserToRoom(roomId, user) {
        if (!this.roomExists(roomId)) {
            throw new Error("Room doesn't exist");
        }
        const room = this.rooms.get(roomId);
        if (!room) {
            return;
        }
        room.addUser(user);
    }
}
exports.RoomHandler = RoomHandler;
exports.roomHandler = new RoomHandler();
const getRoom = (roomId) => {
    return exports.roomHandler.getRoom(roomId);
};
exports.getRoom = getRoom;
class Room {
    constructor(id, users) {
        this.users = new usersHandler_1.UsersHandlers();
        this.id = id;
        this.users = new usersHandler_1.UsersHandlers();
        if (users === null || users === void 0 ? void 0 : users.length) {
            users.forEach((user) => {
                this.users.addUser(user);
            });
        }
    }
}
exports.Room = Room;
class ChatRoom {
    addUser(user) {
        var _a;
        if (((_a = this.messages.conversation) === null || _a === void 0 ? void 0 : _a.users.length) &&
            this.messages.conversation.users.find((u) => u.id === user.id)) {
            this.users.addUser(user);
        }
    }
    constructor(id, users) {
        this.users = new usersHandler_1.UsersHandlers();
        this.messages = new ConversationHandler_1.ConversationHandler();
        this.messages = new ConversationHandler_1.ConversationHandler();
        this.id = id;
        if (users === null || users === void 0 ? void 0 : users.length) {
            users.forEach((user) => {
                this.users.addUser({
                    id: user.id.toString(),
                    state: users_1.UserState.online,
                    socketId: user.socketId,
                });
                // this.messages.addUser(user.id.toString());
            });
        }
    }
    getConversation() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.messages.getConversation(this.id);
            console.log(this.messages.conversation);
        });
    }
    delete() { }
}
exports.ChatRoom = ChatRoom;
class QueueRoom {
    constructor(id) {
        this.gameQueue = matchQueue_1.gameQueue;
        this.id = id;
        this.users = new usersHandler_1.UsersHandlers();
    }
    addUser(user) {
        this.users.addUser(user);
        return user;
    }
    delete() { }
}
exports.QueueRoom = QueueRoom;
class GameRoom {
    constructor(id, game, users) {
        this.match = new gameHandlers_1.MatchHandler(new rockpaperScissors_1.RockPaperScissorsGame());
        this.id = id;
        this.users = new usersHandler_1.UsersHandlers();
        if (users === null || users === void 0 ? void 0 : users.length) {
            users.forEach((user) => {
                this.users.addUser(user);
            });
        }
        this.match = new gameHandlers_1.MatchHandler(game);
    }
    addUser(user) {
        this.users.addUser(user);
    }
    delete() {
        this.users.getUsers().forEach((user) => {
            // uhandler.updateUser(user.id, {
            console.log(user);
            //   game: {
            //     state: UserGameState.idle,
            //     gameId: null,
            //   },
            // });
        });
    }
}
exports.GameRoom = GameRoom;
