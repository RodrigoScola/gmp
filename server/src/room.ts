import { RockPaperScissorsGame } from "./game/rockpaperScissors";
import { SocketUser } from "./server";
export class RoomHandler {
  rooms: Map<string, Room>;
  constructor() {
    this.rooms = new Map();
  }
  roomExists(roomId: string) {
    return this.rooms.has(roomId);
  }
  createRoom(roomId: string) {
    if (!this.roomExists(roomId)) {
      this.rooms.set(roomId, new Room(roomId, []));
    }
  }
  getRoom(roomId: string) {
    return this.rooms.get(roomId);
  }

  addUserToRoom(roomId: string, user: SocketUser) {
    if (!this.roomExists(roomId)) {
      this.createRoom(roomId);
    }
    const room = this.rooms.get(roomId);
    if (!room) {
      return;
    }
    if (room.users.find((i) => i.id == user.id)) {
      room.users.push({
        ...user,
      });
      return;
    }
    room.users.push(user);
  }
}
export class Room {
  id: string;
  users: SocketUser[];
  game: RockPaperScissorsGame;
  constructor(id: string, users: []) {
    this.id = id;
    this.users = users;
    this.game = new RockPaperScissorsGame();
  }
}
