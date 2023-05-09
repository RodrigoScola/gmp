import { SocketUser } from "../server";
import { TicTacToeGame } from "../game/TicTacToeGame";
import { RockPaperScissorsGame } from "../game/rockpaperScissors";
import { Game } from "../../../web/types";
export class RoomHandler {
  rooms: Map<string, Room>;

  constructor() {
    this.rooms = new Map();
  }
  roomExists(roomId: string) {
    return this.rooms.has(roomId);
  }
  createRoom(roomId: string, users: SocketUser[] = [], game?: Game) {
    if (!this.roomExists(roomId)) {
      this.rooms.set(roomId, new Room(roomId, [], game));
    }
    return this.rooms.get(roomId);
  }
  getRoom(roomId: string): Room | undefined {
    if (!this.rooms.has(roomId)) return;
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
  game?: Game;
  constructor(id: string, users: [], game?: Game) {
    this.id = id;
    this.users = users;
    if (game) {
      this.game = game;
    }
  }
}
