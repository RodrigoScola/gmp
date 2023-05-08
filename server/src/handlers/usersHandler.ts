import { User } from "../../../web/types";
class UsersHandlers {
  users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }
  addUser(user: User) {
    this.users.set(user.id, user);
  }
  getUser(id: string) {
    return this.users.get(id);
  }
  deleteUser(id: string) {
    this.users.delete(id);
  }
}
export const usersHandlers = new UsersHandlers();

export class PlayerHandler<T = User> {
  players: Record<string, T> = {};
  addPlayer(player: T) {
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
