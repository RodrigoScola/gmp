import { SocketUser } from "../server";
import { Game, User, UserGameState, gameNames } from "../../../web/types";
import { MatchHandler, getGame } from "./Handlers";
import { RockPaperScissorsGame } from "../game/rockpaperScissors";
import { MainUser, UsersHandlers, uhandler } from "./usersHandler";
import { MessageHandler } from "./MessageHandler";
export class RoomHandler {
  rooms: Map<string, IRoom>;

  constructor() {
    this.rooms = new Map<string, IRoom>();
  }
  roomExists(roomId: string) {
    return this.rooms.has(roomId);
  }
  createRoom<T extends GameRoom | ChatRoom>(roomId: string, room: IRoom): T {
    if (!this.roomExists(roomId)) {
      this.rooms.set(roomId, room);
    }
    return this.rooms.get(roomId) as T;
  }
  getRoom<T extends GameRoom | ChatRoom>(roomId: string): T | undefined {
    if (!this.rooms.has(roomId)) return;
    return this.rooms.get(roomId) as T;
  }
  deleteRoom(roomId: string) {
    if (!this.roomExists(roomId)) return;
    const room = this.rooms.get(roomId);
    if (!room) return;
    room.delete();
    this.rooms.delete(roomId);
  }

  addUserToRoom(roomId: string, user: SocketUser) {
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
export const roomHandler = new RoomHandler();

export const getRoom = (roomId: string) => {
  return roomHandler.getRoom(roomId);
};

export interface IRoom {
  id: string;
  users: UsersHandlers;
  addUser(user: SocketUser): void;
  delete(): void;
}

export class Room implements Room {
  id: string;
  users: UsersHandlers = new UsersHandlers();
  constructor(id: string, users?: SocketUser[]) {
    this.id = id;
    this.users = new UsersHandlers();
    if (users?.length) {
      users.forEach((user) => {
        this.users.addUser(user);
      });
    }
  }
}

export class ChatRoom implements IRoom {
  id: string;
  users: UsersHandlers = new UsersHandlers();
  messages: MessageHandler = new MessageHandler();
  addUser(user: SocketUser): void {
    this.users.addUser(user);
    this.messages.addUser(user.id);
  }
  constructor(id: string, users?: SocketUser[]) {
    this.messages = new MessageHandler();
    this.id = id;
    if (users?.length) {
      users.forEach((user) => {
        this.users.addUser(user);
        this.messages.addUser(user.id);
      });
    }
  }
  delete(): void {}
}
export class GameRoom implements IRoom {
  id: string;
  users: UsersHandlers;
  match: MatchHandler = new MatchHandler(new RockPaperScissorsGame());
  constructor(id: string, game: Game, users?: SocketUser[]) {
    this.id = id;
    this.users = new UsersHandlers();
    if (users?.length) {
      users.forEach((user) => {
        this.users.addUser(user);
      });
    }

    this.match = new MatchHandler(game);
  }
  addUser(user: SocketUser): void {
    this.users.addUser(user);
  }
  delete(): void {
    this.users.getUsers().forEach((user: MainUser) => {
      // uhandler.updateUser(user.id, {
      //   game: {
      //     state: UserGameState.idle,
      //     gameId: null,
      //   },
      // });
    });
  }
}
