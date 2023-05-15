import {
  ChatUserState,
  GameInvite,
  GameNames,
  GamePlayState,
  SocketUser,
  User,
  UserGameState,
} from "../../../web/types";
import { GameInviteHandler } from "./GameInvitehandler";
import { Room } from "./room";

export type MainUser = {
  user: SocketUser;
  id: string;
  chatState: ChatUserState;
  game?: {
    state: UserGameState;
    gameId: string | null;
  };
  socketId: string;
};
class MainUserHandler {
  users: Map<string, MainUser>;
  invites: GameInviteHandler;

  constructor() {
    this.users = new Map<string, MainUser>();
    this.invites = new GameInviteHandler();
  }
  addUser(user: SocketUser) {
    this.users.set(user.id, {
      chatState: ChatUserState.online,
      user,
      id: user.id,
      socketId: user.socketId,
    });
  }
  updateUser(userId: string, info: Partial<MainUser>) {
    const user = this.users.get(userId);
    if (!user) return;
    const nuser: MainUser = { ...user, ...info, socketId: user.socketId };
    this.users.set(userId, nuser);
  }
  getUsers() {
    return Array.from(this.users.values());
  }
  getUser(id: string) {
    // console.log(this.users.get(id));
    return this.users.get(id);
  }
  deleteUser(id: string) {
    this.users.delete(id);
  }
}

export const uhandler = new MainUserHandler();

export type RoomUser = {
  user: MainUser;
  socketId: string;
};
export class UsersHandlers {
  users: Map<
    string,
    {
      socketId: string;
      userId: string;
    }
  >;

  constructor() {
    this.users = new Map<string, { socketId: string; userId: string }>();
  }
  addUser(user: SocketUser) {
    // if (!user.id) return;
    this.users.set(user.id, {
      socketId: user.socketId,
      userId: user.id,
    });
  }
  getUsers(): RoomUser[] {
    let users: RoomUser[] = [];
    this.users.forEach((userId) => {
      const u = uhandler.getUser(userId.userId);
      users.push({
        socketId: userId.socketId,
        user: u as MainUser,
      });
    });
    return users;
  }
  getUser(id: string) {
    const user = uhandler.getUser(id);
    console.log(user);
    return uhandler.getUser(id);
  }
  deleteUser(id: string) {
    this.users.delete(id);
  }
}
export class PlayerHandler<T = User> {
  players: Record<string, T & { id: string }> = {};
  addPlayer(player: T & { id: string }) {
    if (this.players[player.id]) return;
    this.players[player.id] = player;
  }
  getPlayers(): T[] {
    return Object.values(this.players);
  }
  getPlayer(playerId: string) {
    return this.players[playerId];
  }
  removePlayer(playerId: string) {
    delete this.players[playerId];
  }
  hasPlayer(playerId: string) {
    return !!this.players[playerId];
  }
}
