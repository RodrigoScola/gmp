import { io, Socket as SC } from "socket.io-client";
import {
  ServerToClientEvents,
  ClientToServerEvents,
  ChatClientEvents,
  ChatServerEvents,
  GameQueueClientEvents,
  GameQueueServerEvents,
} from "@/types/socketEvents";
import { ExtendedUser, IUser } from "@/types/users";
import { GameNames } from "@/types/game";

const socketUrl = "ws://localhost:3001";

export const socket: SC<ClientToServerEvents, ServerToClientEvents> = io(
  socketUrl,
  {
    transports: ["websocket"],
    autoConnect: false,
  }
);

export type SocketAuth = {
  user: IUser;
  roomId: string;
  gameName: GameNames;
};

export const chatSocket: SC<ChatServerEvents, ChatClientEvents> = io(
  `${socketUrl}/chat`,
  {
    transports: ["websocket"],
    autoConnect: false,
  }
);
export const userSocket: SC<ChatServerEvents, ChatClientEvents> = io(
  `${socketUrl}/user`,
  {
    transports: ["websocket"],
    autoConnect: false,
  }
);

export const queueSocket: SC<GameQueueServerEvents, GameQueueClientEvents> = io(
  `${socketUrl}/gamequeue`,
  {
    transports: ["websocket"],
    autoConnect: false,
  }
);
export const newSocketAuth = (params: SocketAuth): SocketAuth => {
  return {
    user: params.user,
    roomId: params.roomId,
    gameName: params.gameName,
  };
};
