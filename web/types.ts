import { UsersResponse } from "./pocketbase-types";

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

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
export type RockPaperScissorsRound = {
  winner: RockPaperScissorPlayer;
  loser: RockPaperScissorPlayer;
  isTie: boolean;
};

export type Rounds = {
  count: number;
  rounds: RockPaperScissorsRound[];
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
export interface GameType {
  name: GameNames;
  id: number;
}

export interface FriendGameType extends GameType {
  played: number;
  won: number;
  lost: number;
}
export interface SimonSaysGameType extends FriendGameType {
  name: "Simon Says";
}
export interface ConnectFourGameType extends FriendGameType {
  name: "connect Four";
}
export interface RockPaperScissorsGameType extends FriendGameType {
  name: "Rock Paper Scissors";
}
export interface TicTacToeGameType extends FriendGameType {
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

export const RockPaperScissorsOptionsValues = [
  "rock",
  "paper",
  "scissors",
] as const;
export type RockPaperScissorsOptions =
  (typeof RockPaperScissorsOptionsValues)[number];
export type RockPaperScissorsCombination = {
  winner: RockPaperScissorsOptions;
  loser: RockPaperScissorsOptions;
  tie?: RockPaperScissorsOptions;
};
export const RockPaperScissorsWinCombination: RockPaperScissorsCombination[] = [
  { winner: "rock", loser: "scissors" },
  { winner: "paper", loser: "rock" },
  { winner: "scissors", loser: "paper" },
];

export interface RockPaperScissorPlayer extends Partial<User> {
  id: string;
  choice: RockPaperScissorsOptions | null;
}

export interface RockPaperScissorsChoice {
  id: string;
  choice: RockPaperScissorsOptions | null;
}

export interface SocketEvents {
  join_room: (roomId: string) => void;
}
