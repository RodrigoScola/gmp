import { MatchHandler } from "./gameHandlers";
import { RockPaperScissorsGame } from "../game/rockpaperScissors";
import { UsersHandlers } from "./usersHandler";
import { ConversationHandler } from "./ConversationHandler";
import { MatchQueue, gameQueue } from "./matchQueue";
import { ChatUser, QueueRoomuser, SocketUser, UserState } from "../types/users";
import { IGame } from "../types/game";
export class RoomHandler {
  rooms: Map<string, IRoom>;

  constructor() {
    this.rooms = new Map<string, IRoom>();
  }
  roomExists(roomId: string) {
    return this.rooms.has(roomId);
  }
  createRoom<T extends IRoom>(roomId: string, room: IRoom): T {
    if (!this.roomExists(roomId)) {
      this.rooms.set(roomId, room);
    }
    return this.rooms.get(roomId) as T;
  }
  getRoom<T extends IRoom>(roomId: string): T | undefined {
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

  addUserToRoom<T>(roomId: string, user: T) {
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
  users: UsersHandlers<any>;
  addUser(user: any): void;
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
  users: UsersHandlers<ChatUser> = new UsersHandlers<ChatUser>();
  messages: ConversationHandler = new ConversationHandler();

  addUser(user: ChatUser): void {
    if (
      this.messages.conversation?.users.length &&
      this.messages.conversation.users.find((u: any) => u.id === user.id)
    ) {
      this.users.addUser(user);
    }
  }
  constructor(id: string, users?: SocketUser[]) {
    this.messages = new ConversationHandler();
    this.id = id;
    if (users?.length) {
      users.forEach((user) => {
        this.users.addUser({
          id: user.id.toString(),
          state: UserState.online,
          socketId: user.socketId,
        });
        // this.messages.addUser(user.id.toString());
      });
    }
  }
  async getConversation() {
    await this.messages.getConversation(this.id);
    console.log(this.messages.conversation);
  }
  delete(): void {}
}
export class QueueRoom implements IRoom {
  id: string;

  gameQueue: MatchQueue = gameQueue;
  users: UsersHandlers<QueueRoomuser>;
  constructor(id: string) {
    this.id = id;
    this.users = new UsersHandlers();
  }

  addUser(user: QueueRoomuser): QueueRoomuser {
    this.users.addUser(user);
    return user;
  }
  delete(): void {}
}
export class GameRoom implements IRoom {
  id: string;
  users: UsersHandlers;
  match: MatchHandler = new MatchHandler(new RockPaperScissorsGame() as IGame);
  constructor(id: string, game: IGame, users?: SocketUser[]) {
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
