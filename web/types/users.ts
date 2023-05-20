import { Database } from "@/supabasetypes";
import { GameNames } from "./game";
import { Badges } from "./types";

export interface SocketUser extends IUser {
  socketId: string;
}

export type OnlineStatusType = "online" | "offline" | "away";

export type IUser = Database["public"]["Tables"]["profiles"]["Row"];
export type ChatUser = {
  state: ChatUserState;
  id: string;
  socketId: string;
};

export type QueueRoomuser = {
  id: string;
};
export type ChatMessageType = {
  userId: string;
  message: string;
  created: string;
  id: string;
};
export type NewChatChatMessageType = Omit<ChatMessageType, "id" | "created">;
export type ChatConversationType = {
  id: string;
  users: Partial<IUser> & { id: string }[];
  messages: ChatMessageType[];
};

export interface Friend extends IUser {
  status: OnlineStatusType;
  note?: string;
}

export interface ExtendedUser extends IUser {
  badges?: Badges;
  games?: FriendsGamesType;
}

export type GameInviteOptions = "accepted" | "declined" | "pending";
export type GameInvite = {
  from: IUser;
  to: IUser;
  inviteId: string;
  gameName: GameNames;
  roomId: string;
  state: GameInviteOptions;
};

export interface FriendGameType {
  played: number;
  won: number;
  name: GameNames;
  id: number;
  lost: number;
}

export type FriendsGamesType = {
  [key in GameNames]: FriendGameType;
};

export enum ChatUserState {
  typing = "typing",
  inChat = "inChat",
  online = "online",
  offline = "offline",
}

export enum UserGameState {
  playing = "playing",
  waiting = "waiting",
  selecting = "selecting",
  idle = "idle",
}

export enum GamePlayState {
  selecting,
  waiting,
  playing,
  results,
  end,
}
