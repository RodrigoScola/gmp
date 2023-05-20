import { GameNames } from "../../../web/types/game";
import { MatchQueuePlayer } from "../matchQueue";

export class GameQueue {
  players: MatchQueuePlayer[];
  private ids: Set<string>;
  public length: number;
  constructor(public gameName: GameNames) {
    this.players = [];
    this.length = 0;
    this.ids = new Set<string>();
  }
  add(id: string, player: MatchQueuePlayer) {
    if (this.ids.has(id)) return;
    this.players.push(player);
    this.length++;
    this.ids.add(id);
  }
  remove(playerId: string) {
    if (!this.ids.has(playerId)) return;
    this.players = this.players.filter((i) => i.id != playerId);
    this.length--;
    this.ids.delete(playerId);
  }
}
