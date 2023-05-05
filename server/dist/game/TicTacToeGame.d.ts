import { MoveChoice, TicTacToeOptions, User } from "../../../web/types";
export declare class PlayerHandler {
    players: Record<string, User>;
    addPlayer(player: User): void;
    getPlayers(): User[];
    getPlayer(playerId: string): User | undefined;
    removePlayer(playerId: string): void;
    hasPlayer(playerId: string): boolean;
}
export declare class TicTacToeGame {
    players: PlayerHandler;
    addPlayer(player: User): void;
    getPlayers(): User[];
    hasGameWinner(): User | null;
    play<T extends MoveChoice<TicTacToeOptions>, K extends T["choice"]>(choice: T, move: K): void;
    hasRoundWinner(): null;
}
