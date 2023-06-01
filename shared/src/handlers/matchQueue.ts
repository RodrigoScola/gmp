import { GameNames, GameType, gameNames } from "../types/game";
import { GameData, getGameData } from "../game/gameUtils";
import { PlayerHandler } from "./usersHandler";
import { GameQueue } from "./GamesQueue";
import { randomUUID } from "crypto";

export type MatchQueuePlayer = {
     games: GameType | GameType[];
     id: string;
};

export type Match = {
     id: string;
     game: GameData;
     players: MatchQueuePlayer[];
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
          player.games = Array.isArray(player.games)
               ? player.games
               : [player.games];
          player.games.forEach((game: GameType) => {
               const gameId = getGameData(game.name as GameNames).id;
               this.gamesQueue[gameId].add(player.id, player);
          });
          return player;
     }
     removePlayer(player: string): void {
          const queues = Object.values(this.gamesQueue);

          this.players.removePlayer(player);
          queues.forEach((queue) => {
               queue.remove(player);
          });
     }
     findMatch(userId: string) {
          const player = this.players.getPlayer(userId);
          if (!player) return;
          const queues = Object.values(this.gamesQueue).filter((queue) => {
               const gamedata = getGameData(queue.gameName);
               const includes = !!queue.players.find((x) => x.id == player.id);
               const l = queue.length >= gamedata.playerCount;
               return includes && l;
          });
          return queues[Math.floor(Math.random() * queues.length)];
     }
     newMatch(game: GameData, players: MatchQueuePlayer[]): Match {
          return {
               id: randomUUID(),
               game: game,
               players: players,
          };
     }
     matchPlayer(queue: GameQueue): MatchQueuePlayer[] | undefined {
          const data = getGameData(queue.gameName);
          if (queue.length == data.playerCount) {
               const players = queue.players.slice(0, data.playerCount);
               players.forEach((player) => {
                    this.removePlayer(player);
               });
               return players;
          }
          return;
     }
}

export const gameQueue = new MatchQueue();
