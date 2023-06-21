import { RoundHandler } from "../handlers/RoundHandler";
import { PlayerHandler } from "../handlers/usersHandler";
import { Game, GameNames, RPSMove, RPSOptions, RPSPlayer, RPSRound, RPSstate } from "../types/game";
export declare const RockPaperScissorsMaxWins = 5;
export declare class RockPaperScissorsGame extends Game<"Rock Paper Scissors"> {
    name: GameNames;
    players: PlayerHandler<RPSPlayer>;
    currentChoice: Record<string, RPSMove>;
    rounds: RoundHandler<RPSRound>;
    constructor();
    play(player: RPSPlayer, choice: RPSOptions): void;
    addPlayer(player: RPSPlayer): void;
    isReady(): boolean;
    getPlayers(): RPSPlayer[];
    hasRoundWinner(): RPSRound | null;
    isRoundWinner(player: RPSPlayer): boolean;
    getOpponents(player: RPSPlayer): RPSMove[];
    isTie(): boolean;
    getWinnerCombination: (opt1: RPSOptions, opt2: RPSOptions) => RPSOptions;
    getWinner: (player1: RPSPlayer, player2: RPSPlayer) => RPSRound | null;
    newRound(): void;
    hasGameWinner(): RPSPlayer | null;
    isGameWinner(playerId: string): boolean;
    getState(): RPSstate;
    hasGameWin(): RPSPlayer | null;
}
