import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { TicTacToeGame } from "../game/TicTacToeGame";
import { CFGame } from "../game/c4Game";
import { RockPaperScissorsGame } from "../game/rockpaperScissors";
import { SimonSaysGame } from "../game/simonSays";
import { GameNames } from "../types/game";
import { ClientToServerEvents, ServerToClientEvents } from "../types/socketEvents";
import { MySocket, SocketData } from "../types/types";
import { IUser } from "../types/users";
import { PlayerHandler } from "./usersHandler";
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
    playGame(io: Server<ServerToClientEvents, ClientToServerEvents, DefaultEventsMap, SocketData>, socket: MySocket, game: IGame): void;
}
export declare const getGame: (gameName: GameNames) => IGame;
export {};
