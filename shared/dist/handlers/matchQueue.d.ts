import { GameData } from "../game/gameUtils";
import { GameType } from "../types/game";
import { GameQueue } from "./GamesQueue";
import { PlayerHandler } from "./usersHandler";
export type MatchQueuePlayer = {
    games: GameType | GameType[];
    id: string;
};
export type Match = {
    id: string;
    game: GameData;
    players: MatchQueuePlayer[];
};
export declare class MatchQueue {
    players: PlayerHandler<MatchQueuePlayer>;
    gamesQueue: Record<string, GameQueue>;
    constructor();
    addPlayer(player: MatchQueuePlayer): MatchQueuePlayer;
    removePlayer(player: string): void;
    findMatch(userId: string): GameQueue | undefined;
    newMatch(game: GameData, players: MatchQueuePlayer[]): Match;
    matchPlayer(queue: GameQueue): MatchQueuePlayer[] | undefined;
}
export declare const gameQueue: MatchQueue;
