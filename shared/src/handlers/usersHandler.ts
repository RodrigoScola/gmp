import { Player } from "../types/game";
import { SocketUser, UserGameState, UserState } from "../types/users";
import { FriendHandler } from "./FriendHandler";
import { GameInviteHandler } from "./GameInvitehandler";

export type IMainUser = {
     user: SocketUser;
     id: string;
     currentState: UserState;
     game?: {
          state: UserGameState;
          gameId: string | null;
     };
     socketId: string;
};
export class MainUser implements IMainUser {
     user: SocketUser;
     id: string;
     currentState: UserState;
     friends: FriendHandler;
     game?: { state: UserGameState; gameId: string | null };
     socketId: string;

     constructor(user: IMainUser) {
          this.currentState = user.currentState;
          if (user.game) {
               this.game = user.game;
          }

          this.id = user.id;
          this.socketId = user.socketId;
          this.user = user.user;
          this.friends = new FriendHandler(this.user.id);
     }
}
class MainUserHandler {
     users: Map<string, MainUser>;
     invites: GameInviteHandler;
     userNames: Map<string, string>;
     constructor() {
          this.users = new Map<string, MainUser>();
          this.userNames = new Map<string, string>();
          this.invites = new GameInviteHandler();
     }
     addUser(user: SocketUser) {
          if (!user.id) return;
          user.id = user.id.toString();
          const mainUser = new MainUser({
               currentState: UserState.online,
               game: {
                    gameId: null,
                    state: UserGameState.waiting,
               },
               user,
               id: user.id,
               socketId: user.socketId,
          });
          this.users.set(user.id, mainUser);
          if (user.username) {
               this.userNames.set(user.username, user.id);
          }
          return mainUser;
     }
     updateUser(
          userId: string,
          info: Partial<IMainUser>
     ): IMainUser | undefined {
          const user = this.users.get(userId);
          if (!user) return;
          const nuser: IMainUser = {
               ...user,
               ...info,
               socketId: user.socketId,
          };
          this.users.set(userId, new MainUser(nuser));
          return this.getUser(userId);
     }
     getUsers(): MainUser[] {
          const users = Array.from(this.users.values());
          return users.map((user) => user);
     }

     getUser(id: string): MainUser | undefined {
          // console.log(this.users.get(id));
          const user = this.users.get(id);
          if (user) {
               return user;
          }
          return;
     }
     getUserByUsername(username: string) {
          if (!this.userNames.has(username)) return;
          return this.userNames.get(username);
     }
     deleteUser(id: string) {
          this.users.delete(id);
     }
}

export const uhandler = new MainUserHandler();

export type RoomUser = {
     user: IMainUser;
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
export class PlayerHandler<T extends Player> {
     players: Record<string, T & { id: string }> = {};
     length: number;
     constructor() {
          this.length = 0;
     }
     addPlayer(player: T & { id: string }) {
          if (this.players[player.id]) return;
          this.players[player.id] = player;
          this.length++;
     }
     getPlayers(): T[] {
          return Object.values(this.players);
     }
     getPlayer(playerId: string) {
          return this.players[playerId];
     }
     removePlayer(playerId: string) {
          if (!this.players[playerId]) return;
          delete this.players[playerId];

          this.length--;
     }
     hasPlayer(playerId: string) {
          return !!this.players[playerId];
     }
}
