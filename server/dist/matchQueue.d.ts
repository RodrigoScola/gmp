import { GameType } from "../../shared/types/game";
import { PlayerHandler } from "../../shared/handlers/usersHandler";
import { GameQueue } from "./lib/GamesQueue";
export type MatchQueuePlayer = {
    games: GameType | GameType[];
    id: string;
};
export declare class MatchQueue {
    players: PlayerHandler<MatchQueuePlayer>;
    gamesQueue: Record<string, GameQueue>;
    constructor();
    addPlayer(player: MatchQueuePlayer): MatchQueuePlayer;
    removePlayer(player: MatchQueuePlayer): void;
    findMatch(userId: string): GameQueue | undefined;
    matchPlayer(queue: GameQueue): MatchQueuePlayer[] | undefined;
}
export declare const gameQueue: MatchQueue;
