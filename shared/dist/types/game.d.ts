import { RoundHandler } from "../handlers/RoundHandler";
import { Coords } from "./types";
import { PlayerHandler } from "../handlers/usersHandler";
import { CFGame } from "../game/c4Game";
import { SimonSaysGame } from "../game/simonSays";
import { TicTacToeGame } from "../game/TicTacToeGame";
import { RockPaperScissorsGame } from "../game/rockpaperScissors";
export type GameInfo<T extends GameNames> = GamesInfo[T];
export declare abstract class Game<T extends GameNames> {
    abstract name: GameNames;
    abstract rounds: RoundHandler<GameInfo<T>["round"]>;
    abstract isReady(): boolean;
    abstract getPlayers(): GameInfo<T>["player"][];
    abstract players: PlayerHandler<GameInfo<T>["player"]>;
    abstract play(...args: any): void;
    abstract newRound(): void;
    abstract addPlayer(player: GameInfo<T>["player"]): void;
    abstract getState(): GameInfo<T>["state"];
}
export type IGame = CFGame & SimonSaysGame & TicTacToeGame & RockPaperScissorsGame;
export type Igame = IGame;
export type GameNames = "Simon Says" | "connect Four" | "Rock Paper Scissors" | "Tic Tac Toe";
export declare const gameNames: GameNames[];
export type Player = {
    id: string;
};
export interface CFplayer extends Player {
    choice: ConnectChoices;
}
export interface TTCPlayer extends Player {
    choice?: TTCOptions;
}
export interface RPSPlayer extends Player {
    choice: RPSOptions | null;
}
export interface SMSPlayer extends Player {
}
export type SMSColorType = "red" | "blue" | "green" | "yellow";
export declare const RPSOptionsValues: readonly ["rock", "paper", "scissors"];
export type RPSOptions = (typeof RPSOptionsValues)[number];
export type TTCOptions = "X" | "O";
export type ConnectChoices = "red" | "blue";
export type RPSCombination = {
    winner: RPSOptions;
    loser: RPSOptions;
    tie?: RPSOptions;
};
export type TTCCombination = {
    winner: "tie" | string | null;
    loser: string | null;
    isTie: boolean;
    board: TTCMove[] | null;
};
export declare const RPSWinCombination: RPSCombination[];
export type RoundType<T extends RPSRound | CFRound | SMSRound | TTCRound> = {
    winner?: {
        id: string;
    };
    isTie: boolean;
    moves: T;
};
export type TTCRound = {
    winner: {
        id: string;
    };
    loser: {
        id: string;
    };
    isTie: boolean;
    moves: TTCMove[];
};
export type CFRound = {
    moves: CFMove[];
};
export type RPSRound = {
    winner: RPSPlayer;
    loser: RPSPlayer;
    isTie: boolean;
    moves: MoveChoice<RPSMove>[];
};
export type SMSRound = {
    sequence: SMSMove[];
};
export type Rounds = {
    count: number;
    rounds: RPSRound[];
    wins: {
        [key: string]: number;
        ties: number;
    };
};
export type CFMove = MoveChoice<{
    color: ConnectChoices;
    coords: Coords;
}>;
export type RPSMove = MoveChoice<{
    choice: RPSOptions;
}>;
export type TTCMove = MoveChoice<{
    coords: Coords;
    choice: TTCOptions;
}>;
export type SMSMove = MoveChoice<{
    color: SMSColorType;
}>;
export type MoveChoice<T> = {
    id: string;
} & T;
export interface SMState {
    name: GameNames;
    players: TTCPlayer[];
    rounds: {
        count: number;
        rounds: RoundType<SMSRound>[];
    };
    speed: number;
    sequence: SMSColorType[];
}
export interface RPSstate {
    players: RPSPlayer[];
    moves: RPSMove[];
    name: GameNames;
    rounds: {
        count: number;
        rounds: RoundType<RPSRound>[];
    };
}
export interface CFState {
    players: CFplayer[];
    board: CFMove[][];
    currentPlayerTurn: CFplayer;
    moves: CFMove[];
    name: GameNames;
    rounds: {
        count: number;
        rounds: RoundType<CFRound>[];
        wins: {
            [key: string]: number;
            ties: number;
        };
    };
}
export interface TTCState {
    players: TTCPlayer[];
    board: TTCMove[][];
    currentPlayerTurn: TTCPlayer;
    moves: TTCMove[];
    name: GameNames;
    rounds: {
        count: number;
        rounds: RoundType<TTCRound>[];
    };
}
export declare enum SimonGameState {
    START = "Start",
    PLAYING = "Playing",
    END = "End",
    WAITING = "Waiting"
}
export interface GameComponentProps {
    gameId: string;
    gameName: GameNames;
}
export declare enum TicTacToeGameState {
    START = "Start",
    PLAYING = "Playing",
    END = "End",
    TIE = "TIE",
    ENEMYTURN = "Enemy Turn",
    WAITING = "Waiting"
}
export type GamesInfo = {
    "Tic Tac Toe": {
        player: TTCPlayer;
        board: TTCMove[][];
        round: TTCRound;
        state: TTCState;
        move: TTCMove;
    };
    "connect Four": {
        player: CFplayer;
        board: CFMove[][];
        round: CFRound;
        state: CFState;
        move: CFMove;
    };
    "Rock Paper Scissors": {
        player: RPSPlayer;
        board: RPSMove[];
        round: RPSRound;
        state: RPSstate;
        move: RPSMove;
    };
    "Simon Says": {
        player: SMSPlayer;
        board: SMSMove[][];
        round: SMSRound;
        state: SMState;
        move: SMSMove;
    };
};
export declare abstract class Board<T> {
    abstract generateBoard(): void;
    abstract board: T[][];
    abstract moves: T[];
    abstract addMove(move: T): void;
    abstract isValid(board: T[][], x: number, y: number): void;
}
export type GameType = {
    name: GameNames;
    id: number;
};
