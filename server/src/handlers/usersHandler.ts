import {
  CurrentUserState,
  SocketUser,
  User,
  UserGameState,
} from "../../../web/types";
import { GameInviteHandler } from "./GameInvitehandler";

export type MainUser = {
  user: SocketUser;
  id: string;

  currentState: CurrentUserState;
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
      currentState: CurrentUserState.online,
      game: {
        gameId: null,
        state: UserGameState.waiting,
      },
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
export class UsersHandlers<T = { socketId: string }> {
  users: Map<string, T & { id: string }>;

  constructor() {
    this.users = new Map<string, T & { id: string }>();
  }
  addUser(user: T & { id: string }) {
    // if (!user.id) return;
    this.users.set(user.id, user);
  }
  updateUser(userId: string, info: Partial<T>) {
    const user = this.users.get(userId);
    if (!user) return;
    const nuser: T & { id: string } = { ...user, ...info };
    this.users.set(userId, nuser);
  }
  getUsers(): (T & { id: string })[] {
    return Array.from(this.users.values());
  }
  getUser(id: string) {
    const user = this.users.get(id);
    return user;
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
