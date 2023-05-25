import { GameNames } from "../types/game";
import { MatchQueuePlayer } from "./matchQueue";
export declare class GameQueue {
    gameName: GameNames;
    players: MatchQueuePlayer[];
    private ids;
    length: number;
    constructor(gameName: GameNames);
    add(id: string, player: MatchQueuePlayer): void;
    remove(playerId: string): void;
}
