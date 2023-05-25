import { Game, MoveChoice, GameNames, CFState, Board, CFMove, CFRound, CFplayer, RoundType } from "../types/game";
import { PlayerHandler } from "../handlers/usersHandler";
import { RoundHandler } from "../handlers/RoundHandler";
export declare class CFBoard extends Board<CFMove> {
    board: CFMove[][];
    moves: CFMove[];
    rows: number;
    cols: number;
    constructor();
    generateBoard(): CFMove[][];
    addMove(move: CFMove): void;
    checkBoard(): boolean;
    isTie(): boolean;
    isValid(board: CFMove[][], x: number, y: number): boolean;
}
export declare class CFGame extends Game<"connect Four"> {
    name: GameNames;
    board: CFBoard;
    rounds: RoundHandler<CFRound>;
    moves: CFMove[];
    players: PlayerHandler<CFplayer>;
    addPlayer(player: CFplayer): void;
    getPlayers(): CFplayer[];
    isReady(): boolean;
    constructor();
    getState(): CFState;
    newRound(): void;
    isPlayerTurn(playerId: string): boolean;
    playerTurn(): CFMove | CFplayer | undefined;
    getWinner(): RoundType<CFRound> | null;
    play(move: MoveChoice<CFMove>): void;
}
export declare const generateBoard: () => CFMove[][];
