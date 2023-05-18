import { GameNames, GameType, gameNames } from "../../web/types";
import { getGameData } from "./game/gameUtils";
import { PlayerHandler } from "./handlers/usersHandler";
import { GameQueue } from "./lib/GamesQueue";

export type MatchQueuePlayer = {
  games: GameType | GameType[];
  id: string;
};
export class MatchQueue {
  players: PlayerHandler<MatchQueuePlayer>;
  gamesQueue: Record<string, GameQueue>;
  constructor() {
    this.players = new PlayerHandler();
    const gamesQueue: Record<string, GameQueue> = {};
    gameNames.forEach((game) => {
      const gameId = getGameData(game).id;
      gamesQueue[gameId] = new GameQueue(game);
    });
    this.gamesQueue = gamesQueue;
  }
  addPlayer(player: MatchQueuePlayer): MatchQueuePlayer {
    this.players.addPlayer(player);
    console.log(player);
    player.games = Array.isArray(player.games) ? player.games : [player.games];
    player.games.forEach((game: GameType) => {
      const gameId = getGameData(game.name as GameNames).id;
      this.gamesQueue[gameId].add(player.id, player);
    });
    return player;
  }
  removePlayer(player: MatchQueuePlayer): void {
    const queues = Object.values(this.gamesQueue);
    queues.forEach((queue) => {
      queue.remove(player.id);
    });
  }
  findMatch(userId: string) {
    const player = this.players.getPlayer(userId);
    if (!player) return;
    const queues = Object.values(this.gamesQueue).filter((queue) => {
      const gamedata = getGameData(queue.gameName);
      console.log(queue.players);
      const includes = !!queue.players.find((x) => x.id == player.id);

      const l = queue.length >= gamedata.playerCount;

      console.log(queue.gameName, includes, l);
      return includes && l;
    });
    return queues[Math.floor(Math.random() * queues.length)];
  }
  matchPlayer(queue: GameQueue): MatchQueuePlayer[] | undefined {
    const data = getGameData(queue.gameName);
    console.log(queue.length, data.playerCount);
    if (queue.length == data.playerCount) {
      const players = queue.players.slice(0, data.playerCount);
      console.log(players);
      return players;
    }
    return;
  }
}

export const gameQueue = new MatchQueue();
