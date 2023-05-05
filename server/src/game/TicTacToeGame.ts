import { MoveChoice, TicTacToeOptions, User } from "../../../web/types";

export class PlayerHandler {
  players: Record<string, User> = {};
  addPlayer(player: User) {
    if (this.players[player.id]) return;
    this.players[player.id] = player;
  }
  getPlayers(): User[] {
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

export class TicTacToeGame {
  players: PlayerHandler = new PlayerHandler();
  addPlayer(player: User) {
    this.players.addPlayer(player);
  }
  getPlayers(): User[] {
    return this.players.getPlayers();
  }
  hasGameWinner(): User | null {
    return null;
  }
  play<T extends MoveChoice<TicTacToeOptions>, K extends T["choice"]>(
    choice: T,
    move: K
  ): void {
    console.log(choice, move);
  }
  hasRoundWinner(): null {
    return null;
  }
}
