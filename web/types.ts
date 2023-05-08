import { TTCBoardMove } from "@/../server/dist/game/TicTacToeGame";
import { UsersResponse } from "./pocketbase-types";
import { PlayerHandler } from "@/../server/dist/handlers/usersHandler";

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type OmitBy<T, K extends keyof T> = Omit<T, K>;

export type User<T = never> = Omit<
  UsersResponse<T>,
  "emailVisibility" | "collectionId" | "collectionName" | "updated" | "created"
> &
  Partial<
    Pick<UsersResponse<T>, "verified" | "updated" | "created" | "expand">
  >;

export type ChildrenType =
  | React.ReactNode
  | React.ReactNode[]
  | JSX.Element
  | JSX.Element[];

export type Badges = {
  totalBadges: number;
  badges: Badge[];
};

export type Badge = {
  id: number;
  name: string;
  description: string;
  created: string;
};

export type Direction = "up" | "down" | "left" | "right";

export type GameNames =
  | "Simon Says"
  | "connect Four"
  | "Rock Paper Scissors"
  | "Tic Tac Toe";

export const gameNames: GameNames[] = [
  "Simon Says",
  "connect Four",
  "Rock Paper Scissors",
  "Tic Tac Toe",
];
export enum GameState {
  selecting,
  waiting,
  playing,
  results,
  end,
}
export enum SimonGameState {
  START = "Start",
  PLAYING = "Playing",
  END = "End",
  WAITING = "Waiting",
}
export type Coords = {
  x: number;
  y: number;
};
export type RPSRound = {
  winner: RPSPlayer;
  loser: RPSPlayer;
  isTie: boolean;
};

export type Rounds = {
  count: number;
  rounds: RPSRound[];
  wins: {
    [key: string]: number;
    ties: number;
  };
};
export enum TicTacToeGameState {
  START = "Start",
  PLAYING = "Playing",
  END = "End",
  TIE = "TIE",
  ENEMYTURN = "Enemy Turn",
  WAITING = "Waiting",
}
export interface FriendGameType extends Game {
  played: number;
  won: number;
  lost: number;
}
export abstract class Game {
  abstract name: GameNames;
  abstract isReady: () => boolean;
  abstract getPlayers: <T>() => T[];
  abstract players: PlayerHandler;
  abstract play(): void;
  abstract newRound(): void;

  // isPlayerTurn(playerId: string): boolean;
}

export interface SimonSaysGameType extends Game {
  name: "Simon Says";
}
export interface ConnectFourGameType extends Game {
  name: "connect Four";
}
export interface RockPaperScissorsGameType extends Game {
  name: "Rock Paper Scissors";
}
export interface TicTacToeGameType extends Game {
  name: "Tic Tac Toe";
}

export type FriendsGamesType = {
  simonSays: SimonSaysGameType;
  connectFour: ConnectFourGameType;
  rockPaperScissors: RockPaperScissorsGameType;
  ticTacToe: TicTacToeGameType;
};

export interface ExtendedUser {
  badges?: Badges;
  games?: FriendsGamesType;
}

export interface ExtendedFriend extends ExtendedUser {
  note?: string;
}

export type OnlineStatusType = "online" | "offline" | "away";

export interface Friend extends User<ExtendedFriend> {
  status: OnlineStatusType;
}

export type ChatMessageType = {
  userId: string;
  message: string;
  created: string;
  id: string;
};
export type ChatConversationType = {
  id: string;
  users: Partial<User> & { id: string }[];
  messages: ChatMessageType[];
};
export type ToastPositions =
  | "top-center"
  | "top-left"
  | "top-right"
  | "bottom-center"
  | "bottom-left"
  | "bottom-right";

export type ToastThemeType = {
  primary: string;
  secondary: string;
};
export type ToastType = {
  message: string;
  duration: number;
  position: ToastPositions;
  style?: object;
  className?: string;
  icon?: string;
  iconTheme?: ToastThemeType;
};
export type newToastType = Partial<ToastType>;

export type ReturnUserType = User | User<Partial<ExtendedUser>>;

export const RPSOptionsValues = ["rock", "paper", "scissors"] as const;
export type RPSOptions = (typeof RPSOptionsValues)[number];
export type RPSCombination = {
  winner: RPSOptions;
  loser: RPSOptions;
  tie?: RPSOptions;
};
export type TTCCombination = {
  winner: "tie" | string | null;
  loser: string | null;
  isTie: boolean;
  board: TTCBoardMove[] | null;
};
export const RPSWinCombination: RPSCombination[] = [
  { winner: "rock", loser: "scissors" },
  { winner: "paper", loser: "rock" },
  { winner: "scissors", loser: "paper" },
];

export interface RPSPlayer {
  id: string;
  choice: RPSOptions | null;
}

export type TTCOptions = "X" | "O";

export interface TTCPlayer extends Partial<User> {
  id: string;
  choice?: TTCOptions;
}

export type RPSMove = {
  choice: RPSOptions;
};

export type TTCMove = {
  coords: Coords;
  choice: TTCOptions;
};

export interface MoveChoice<T> {
  id: string;
  move: T;
}

export interface ServerToClientEvents {
  join_room: (roomId: string) => void;
  rps_choice: (player: MoveChoice<RPSMove>) => void;
  rps_game_winner: (winner: User | null) => void;
  ttc_game_winner: (winner: TTCCombination) => void;
  ttc_choice: (params: { board: TTCBoardMove[]; move: TTCBoardMove }) => void;
  start_game: () => void;
  round_winner: (round: RPSRound | null) => void;
  player_ready: () => void;
  new_round: () => void;
  get_players: (players: User[]) => void;
  get_state: (game: Game) => void;
  user_disconnected: () => void;
}

export interface ClientToServerEvents {
  join_room: (roomId: string) => void;
  get_players: () => void;
  rps_choice: (player: MoveChoice<RPSMove>) => void;
  rps_game_winner: (winner: RPSRound) => void;
  ttc_choice: (player: MoveChoice<TTCMove>) => void;
  ttc_game_winner: (winner: TTCCombination) => void;
  user_connected: (roomId: string) => void;
  start_game: () => void;
  round_winner: (round: RPSRound) => void;
  player_ready: () => void;
  new_round: () => void;
  user_disconnected: (roomId: string) => void;
}
