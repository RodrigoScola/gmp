import { RoundHandler } from "../handlers/RoundHandler";
import { GameNames, TTCPlayer, TTCMove, Game, TTCState, Board, GameInfo, TTCCombination } from "../types/game";
import { PlayerHandler } from "../handlers/usersHandler";
export declare class TicTacToeBoard extends Board<TTCMove> {
    board: TTCMove[][];
    moves: TTCMove[];
    constructor();
    addMove: (move: TTCMove) => TTCMove[][] | undefined;
    generateBoard: () => TTCMove[][];
    isValid: (board: TTCMove[][], x?: number, y?: number) => boolean;
    newBlock: (params: TTCMove) => TTCMove;
    checkBoard: (board: TTCMove[][]) => TTCCombination;
    checkLine: (diagonal: TTCMove[]) => boolean;
}
export declare const generateBoard: () => TTCMove[][], isValid: (board: TTCMove[][], x?: number, y?: number) => boolean, newBlock: (params: TTCMove) => TTCMove, checkBoard: (board: TTCMove[][]) => TTCCombination, checkLine: (diagonal: TTCMove[]) => boolean;
export declare class TicTacToeGame extends Game<"Tic Tac Toe"> {
    name: GameNames;
    players: PlayerHandler<GameInfo<"Tic Tac Toe">["player"]>;
    board: TicTacToeBoard;
    rounds: RoundHandler<GameInfo<"Tic Tac Toe">["round"]>;
    isPlayerTurn(playerId: string): boolean;
    playerTurn(): TTCPlayer | undefined;
    isReady(): boolean;
    addPlayer(player: TTCPlayer): void;
    newRound(): void;
    getPlayers(): TTCPlayer[];
    play(move: TTCMove): void;
    hasWinner(): (board: TTCMove[][], x?: number, y?: number) => boolean;
    getState(): TTCState;
}
