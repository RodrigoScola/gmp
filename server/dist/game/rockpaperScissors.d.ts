import { MoveChoice, RockPaperScissorsRound, RockPaperScissorPlayer } from "../../../web/types";
import { User, RockPaperScissorsOptions } from "../../../web/types";
import { PlayerHandler, TicTacToeGame } from "./TicTacToeGame";
export declare const RockPaperScissorsMaxWins = 5;
export type Game = RockPaperScissorsGame | TicTacToeGame;
export declare class RoundHandler {
    count: number;
    maxWins: number;
    rounds: RockPaperScissorsRound[];
    addRound(round: RockPaperScissorsRound): void;
    countWins(playerId: string): number;
    isWinner(playerId: string): boolean;
    hasGameWinner(): string | false | undefined;
}
export declare class RockPaperScissorsGame {
    players: PlayerHandler;
    currentChoice: Record<string, MoveChoice>;
    rounds: RoundHandler;
    play(player: RockPaperScissorPlayer, choice: RockPaperScissorsOptions): void;
    addPlayer(player: User): void;
    getPlayers(): User[];
    hasRoundWinner(): RockPaperScissorsRound | null;
    isRoundWinner(player: RockPaperScissorPlayer): boolean;
    getWinnerCombination: (opt1: RockPaperScissorsOptions, opt2: RockPaperScissorsOptions) => RockPaperScissorsOptions;
    getWinner: (player1: RockPaperScissorPlayer, player2: RockPaperScissorPlayer) => RockPaperScissorsRound | null;
    newRound(): void;
    hasGameWinner(): User | null;
    isGameWinner(playerId: string): boolean;
}
