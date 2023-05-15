import {
  ChatUserState,
  GameInvite,
  GameNames,
  GamePlayState,
  User,
  UserGameState,
} from "../../../web/types";
import { SocketUser } from "../server";
import { GameInviteHandler } from "./GameInvitehandler";

type MainUser = {
  user: SocketUser;
  id: string;
  chatState: ChatUserState;
  game: {
    state: UserGameState;
    gameId?: string;
  };
  socketId: string;
};

export class UsersHandlers {
  users: Set<string>;

  constructor() {
    this.users = new Set<string>();
  }
  addUser(user: SocketUser) {
    if (!user.id) return;
    uhandler.addUser(user);
    this.users.add(user.id);
  }
  getUsers() {
    let users: SocketUser = [];
    this.users.forEach((userId) => {
      users.push(uhandler.getUser(userId));
    });
    return users;
  }
  getUser(id: string) {
    return uhandler.getUser(id);
  }
  deleteUser(id: string) {
    this.users.delete(id);
  }
}

class MainUserHandler {
  users: Map<string, MainUser>;
  invites: GameInviteHandler;

  constructor() {
    this.users = new Map<string, MainUser>();
    this.invites = new GameInviteHandler();
  }
  addUser(user: SocketUser) {
    if (!user.id) return;
    this.users.set(user.id, {
      chatState: ChatUserState.online,
      user,
      id: user.id,
      socketId: user.socketId,
      game: {
        state: UserGameState.idle,
      },
    });
  }
  updateUser(userId: string, info: Partial<MainUser>) {
    const user = this.users.get(userId);
    if (!user) return;
    this.users.set(userId, { ...user, ...info });
  }
  getUsers() {
    return Array.from(this.users.values());
  }
  getUser(id: string) {
    return this.users.get(id);
  }
  deleteUser(id: string) {
    this.users.delete(id);
  }
}

export const uhandler = new MainUserHandler();

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
