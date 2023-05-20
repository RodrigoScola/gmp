import express from "express";
const app = express();
import http from "http";
const server = http.createServer(app);
import { Server, Socket, Namespace } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import {
  ServerToClientEvents,
  ChatClientEvents,
  ChatServerEvents,
  GameQueueClientEvents,
  GameQueueServerEvents,
  ClientToServerEvents,
} from "../../web/types/socketEvents";

import { getRoom } from "./handlers/room";
import { IUser } from "../../web/types/users";

import { chatHandlerConnection } from "./connections/chatConnection";
import { userHandlerConnection } from "./connections/userConnection";
import { gamequeueHandlerConnection } from "./connections/gameQueueConnection";

export const io = new Server<
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData
>(server);

type InterServerEvents = {};

export type SocketData = {
  user: IUser;
  roomId: string;
};

export type MyIo = Server<
  ServerToClientEvents,
  ClientToServerEvents,
  DefaultEventsMap,
  SocketData
>;

export type MySocket = Socket<
  ServerToClientEvents,
  ClientToServerEvents,
  DefaultEventsMap,
  SocketData
>;

export const chatHandler: Namespace<
  ChatClientEvents,
  ChatServerEvents,
  DefaultEventsMap,
  SocketData
> = io.of("/chat");

chatHandler.on("connection", (socket) =>
  chatHandlerConnection(chatHandler, socket)
);

export const userHandler: Namespace<
  ChatClientEvents,
  ChatServerEvents,
  DefaultEventsMap,
  SocketData
> = io.of("/user");

userHandler.on("connection", (socket) =>
  userHandlerConnection(userHandler, socket)
);

export const getUserFromSocket = (socket: MySocket): IUser | undefined => {
  const u = socket.handshake.auth["user"];
  if (!u) {
    return;
  }
  return u as IUser;
};
const gamequeueHandler: Namespace<
  GameQueueClientEvents,
  GameQueueServerEvents,
  DefaultEventsMap,
  SocketData
> = io.of("/gamequeue");
gamequeueHandler.on("connection", (socket) =>
  gamequeueHandlerConnection(gamequeueHandler, socket)
);

export const gameId = "a0s9df0a9sdjf";

export const getRoomId = (socket: MySocket) => socket.handshake.auth["roomId"];

app.get("/:roomId", (req, res) => {
  const room = getRoom(req.params.roomId);
  if (!room) {
    res.send({
      room: {},
    });
    return;
  }
  res.send(room);
});
server.listen(3001, () => {
  console.log("listening on *:3001");
});
