import { CFBoard } from "@/../server/src/game/c4Game";
import {
  CFMove,
  CFRound,
  CFState,
  GameNames,
  GameType,
  RPSMove,
  RPSRound,
  RPSstate,
  RoundType,
  SMSMove,
  SMState,
  TTCCombination,
  TTCMove,
  TTCState,
} from "./game";
import { Coords } from "./types";
import {
  ChatMessageType,
  ChatUser,
  GameInvite,
  GameInviteOptions,
  IUser,
  NewChatChatMessageType,
  SocketUser,
} from "./users";

// game events
export interface ServerToClientEvents {
  join_room: (roomId: string) => void;
  rps_choice: (player: RPSMove) => void;
  sms_move: (move: SMSMove) => void;
  sms_game_lost: () => void;
  rps_game_winner: (winner: IUser | null) => void;
  ttc_game_winner: (winner: TTCCombination) => void;
  start_game: (gameState?: CFState | RPSstate | TTCState | SMState) => void;
  rematch: (callback?: (...args: any) => void) => void;
  round_winner: (round: RPSRound | null) => void;
  connect_choice: (move: CFMove) => void;
  connect_game_winner(winner: RoundType<CFRound>): void;
  player_ready: () => void;
  new_round: () => void;
  get_players: (players: IUser[]) => void;
  get_state: (callback: (...args: any) => void) => void;
  ttc_choice: (params: { board: TTCMove[][]; move: TTCMove }) => void;
  user_disconnected: () => void;
  c_player_move: (c: Coords) => void;
}

export interface ClientToServerEvents {
  join_room: (roomId: string) => void;
  sms_game_lost: () => void;
  sms_new_round: (state: CFState | RPSstate | TTCState | SMState) => void;
  rematch: () => void;
  rematch_accept: (state: any) => void;
  get_players: (players: any[]) => void;
  connect_choice: (params: { move: CFMove; board: CFBoard }) => void;
  ttc_choice: (params: { board: TTCMove[][]; move: TTCMove }) => void;
  c_player_move: (c: Coords) => void;
  rps_choice: (player: RPSMove) => void;
  rps_game_winner: (winner: IUser) => void;
  ttc_game_winner: (winner: TTCCombination) => void;
  connect_game_winner(winner: RoundType<CFRound>): void;
  user_connected: (roomId: string) => void;
  get_state: (callback: (...args: any) => void) => void;
  start_game: (gameState?: CFState | RPSstate | TTCState | SMState) => void;
  round_winner: (round: RPSRound) => void;
  player_ready: () => void;
  new_round: () => void;
  user_disconnected: (roomId: string) => void;
}
export interface ChatServerEvents {
  receive_message: (
    message: ChatMessageType,
    callback?: (err: Error | null, data: any) => void
  ) => void;
  notification_message: (params: { user: SocketUser }) => void;
  user_joined: (user: SocketUser[]) => void;
  state_change: (state: ChatUser) => void;
  game_invite: (gameInvite: GameInvite) => void;
  friend_request: (friendid: string, callback: (...args: any) => void) => void;
  game_invite_response: (gameInvite: string) => void;
  game_invite_accepted: (invite: GameInvite) => void;
}
export interface ChatClientEvents {
  join_room: (roomId: string) => void;
  add_friend: (friendid: string, callback: (...args: any) => void) => void;
  add_friend_response: (
    response: "accepted" | "declined",
    callback: (...args: any) => void
  ) => void;
  send_message: (
    message: NewChatChatMessageType,
    callback?: (params: { received: boolean }) => void
  ) => void;
  state_change: (state: any) => void;
  game_invite: (gameName: GameNames, userId: string) => void;
  game_invite_response: (
    action: GameInviteOptions,
    invite: GameInvite,
    callback: (invite: GameInvite) => void
  ) => void;
}

export type GameQueueClientEvents = {
  join_queue: (gameName: GameType | GameType[]) => void;
};
export type GameQueueServerEvents = {
  game_found: (gameid: string) => void;
};
