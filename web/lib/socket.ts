import { io, Socket } from "socket.io-client";
import {
  User,
  ServerToClientEvents,
  ClientToServerEvents,
  GameNames,
  ExtendedUser,
} from "@/types";

export const socket: Socket<ClientToServerEvents, ServerToClientEvents> = io(
  "ws://localhost:3001",
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

export const newSocketAuth = (params: SocketAuth): SocketAuth => {
  return {
    user: params.user,
    roomId: params.roomId,
    gameName: params.gameName,
  };
};
