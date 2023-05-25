import { RockPaperScissorsGame } from "../game/rockpaperScissors";
import { TicTacToeGame } from "../game/TicTacToeGame";
import { MyIo, MySocket } from "../types/types";
import { CFGame } from "../game/c4Game";
import { PlayerHandler } from "./usersHandler";
import { SimonSaysGame } from "../game/simonSays";
import { GameNames } from "../types/game";
import { IUser } from "../types/users";
export declare const getRoomId: (socket: MySocket) => any;
export type IGame = CFGame & SimonSaysGame & TicTacToeGame & RockPaperScissorsGame;
export declare enum MatchPlayerState {
    playing = 0,
    waiting_rematch = 1
}
type MatchPlayer = {
    id: string;
    state: MatchPlayerState;
};
export declare class MatchHandler {
    game: IGame;
    players: PlayerHandler<MatchPlayer>;
    constructor(game: IGame);
    addPlayer(player: IUser): void;
    changePlayerState(playerId: string, state: MatchPlayerState): MatchPlayer | null;
    canRematch(): boolean;
    private getGameHandler;
    getGame(gameName: GameNames): IGame;
    rematch(): IGame;
    newGame(gameName: GameNames): void;
    playGame(io: MyIo, socket: MySocket, game: IGame): void;
}
export declare const getGame: (gameName: GameNames) => IGame;
export {};
