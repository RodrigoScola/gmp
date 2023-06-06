import { CFBoard } from "../game/c4Game";
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
     ChatConversationType,
     ChatMessageType,
     ChatUser,
     GameInvite,
     GameInviteOptions,
     IFriend,
     IUser,
     NewChatChatMessageType,
     SocketUser,
} from "./users";

export type ChatRoomState = {
     id: string;
     users: ChatUser[];
};
export type GameQueueState = {
     length: number;
};

// game events
export interface ServerToClientEvents {
     join_room: (roomId: string) => void;
     rps_choice: (player: RPSMove) => void;
     sms_move: (move: SMSMove) => void;
     sms_game_lost: () => void;
     rps_game_winner: (winner: Partial<IUser> | null) => void;
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
     sms_new_round: (state: SMState) => void;
     rematch: () => void;
     rematch_accept: (state: any) => void;
     get_players: (players: any[]) => void;
     connect_choice: (params: { move: CFMove; board: CFBoard }) => void;
     ttc_choice: (params: { board: TTCMove[][]; move: TTCMove }) => void;
     c_player_move: (c: Coords) => void;
     rps_choice: (player: RPSMove) => void;
     rps_game_winner: (winner: Partial<IUser>) => void;
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
     notification_message: (params: { user: SocketUser }) => void;
     receive_message: (
          message: ChatMessageType,
          callback?: (err: Error | null, data: any) => void
     ) => void;
     user_joined: (user: SocketUser[]) => void;
     state_change: (state: ChatRoomState) => void;
}
export interface ChatClientEvents {
     join_room: (roomId: string) => void;
     find_conversation: (
          user1: string,
          user2: string,
          callback: (conversation: ChatConversationType) => void
     ) => void;
     send_message: (
          message: NewChatChatMessageType,
          callback?: (params: { received: boolean }) => void
     ) => void;
     state_change: (state: any) => void;
}

export type UserServerEvents = {
     friend_request: (
          friendid: string,
          callback: (...args: any) => void
     ) => void;
     update_user: (user: SocketUser) => void;
     add_friend: (friendid: string, callback?: (...args: any) => void) => void;
     game_invite_response: (
          action: GameInviteOptions,
          invite: GameInvite,
          callback: (invite: GameInvite) => void
     ) => void;
     game_invite_accepted: (invite: GameInvite) => void;
     get_friends: (
          userId: string,
          callback: (friends: IUser[]) => void
     ) => void;
     game_invite: (gameName: GameNames, userId: string) => void;
     add_friend_response: (friend: IUser) => void;
     add_friend_answer: (
          from: IUser,
          response: "accepted" | "declined"
     ) => void;
};

export type UserClientEvents = {
     game_invite_accepted: (invite: GameInvite) => void;
     notification_message: (params: { user: SocketUser }) => void;
     get_friends: (
          userId: string,
          callback: (friends: IUser[]) => void
     ) => void;
     game_invite: (gameInvite: GameInvite) => void;
     add_friend_answer: (
          user: IUser,
          response: "accepted" | "declined"
     ) => void;
     game_invite_response: (
          action: GameInviteOptions,
          invite: GameInvite,
          callback: (invite: GameInvite) => void
     ) => void;
     add_friend_response: (user: IUser) => void;
     add_friend: (friendid: string, callback?: (...args: any) => void) => void;
};

export type GameQueueClientEvents = {
     join_queue: (gameName: GameType | GameType[]) => void;
     get_state: (callback: (state: GameQueueState) => void) => void;
};
export type GameQueueServerEvents = {
     game_found: (gameid: string) => void;
     state_change: (state: GameQueueState) => void;
};

export type UsersServerEvents = {
     get_user: (
          userId: string,
          callback?: (user: IUser | null, ...args: any) => void
     ) => void;
     get_friends: (
          userId: string,
          callback?: (friends: IFriend[]) => void
     ) => void;
     search_users: (
          username: string,
          callback?: (...args: any) => void
     ) => void;
};
export type UsersClientEvents = {
     get_friends: (
          userId: string,
          callback?: (friends: IFriend[]) => void
     ) => void;
     search_users: (
          username: string,
          callback?: (...args: any) => void
     ) => void;
};
