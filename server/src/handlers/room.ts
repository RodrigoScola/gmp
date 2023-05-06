import { SocketUser } from "../server";
import { TicTacToeGame } from "../game/TicTacToeGame";
import { RockPaperScissorsGame } from "../game/rockpaperScissors";
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
  deleteRoom(roomId: string) {
    if (!this.roomExists(roomId)) return;

    this.rooms.delete(roomId);
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
        id: "player1",
      });
      return;
    }
    room.users.push(user);
  }
}
export const roomHandler = new RoomHandler();

export const getRoom = (roomId: string) => {
  return roomHandler.getRoom(roomId);
};

export class Room {
  id: string;
  users: SocketUser[];
  game: RockPaperScissorsGame;
  constructor(id: string, users: [], game?: RockPaperScissorsGame) {
    this.id = id;
    this.users = users;

    this.game = new RockPaperScissorsGame();
  }
}
