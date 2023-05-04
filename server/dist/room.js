"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = exports.RoomHandler = void 0;
class RoomHandler {
    constructor() {
        this.rooms = new Map();
    }
    roomExists(roomId) {
        return this.rooms.has(roomId);
    }
    createRoom(roomId) {
        if (!this.roomExists(roomId)) {
            this.rooms.set(roomId, new Room(roomId, []));
        }
    }
    getRoom(roomId) {
        return this.rooms.get(roomId);
    }
    addUserToRoom(roomId, user) {
        if (!this.roomExists(roomId)) {
            this.createRoom(roomId);
        }
        const room = this.rooms.get(roomId);
        if (!room) {
            return;
        }
        if (room.users.find((i) => i.id == user.id)) {
            room.users.push(Object.assign({}, user));
            return;
        }
        room.users.push(user);
    }
}
exports.RoomHandler = RoomHandler;
class Room {
    constructor(id, users) {
        this.id = id;
        this.users = users;
        this.game = new RockPaperScissorsGame();
    }
}
exports.Room = Room;
