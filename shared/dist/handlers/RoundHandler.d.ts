import { CFRound, RPSRound, RoundType, SMSRound, TTCRound } from "../types/game";
export declare class RoundHandler<T extends RPSRound | TTCRound | SMSRound | CFRound> {
    count: number;
    maxWins: number;
    rounds: RoundType<T>[];
    constructor();
    addRound(round: RoundType<T>): void;
    countWins(playerId: string): number;
    isWinner(playerId: string): boolean;
    hasGameWinner(): number | false;
    getWinner(): [string, any] | null;
}
