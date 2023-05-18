import { io, Socket as SC } from "socket.io-client";
import {
  User,
  ServerToClientEvents,
  ClientToServerEvents,
  GameNames,
  ExtendedUser,
  ChatClientEvents,
  ChatServerEvents,
  GameQueueClientEvents,
  GameQueueServerEvents,
} from "@/types";

const socketUrl = "ws://localhost:3001";

export const socket: SC<ClientToServerEvents, ServerToClientEvents> = io(
  socketUrl,
  {
    transports: ["websocket"],
    autoConnect: false,
  }
);

export type SocketAuth = {
  user: User | User<ExtendedUser>;
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
