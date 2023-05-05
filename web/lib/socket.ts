import { io, Socket } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "@/types";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "ws://localhost:3001",
  {
    transports: ["websocket"],
    autoConnect: false,
  }
);
