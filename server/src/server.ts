import express from "express";
import http from "http";
import { Namespace, Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import {
     ChatClientEvents,
     ChatServerEvents,
     ClientToServerEvents,
     GameQueueClientEvents,
     GameQueueServerEvents,
     ServerToClientEvents,
     UsersClientEvents,
     UsersServerEvents,
} from "../../shared/src/types/socketEvents";
import { MyIo, SocketData } from "../../shared/src/types/types";
const app = express();
const server = http.createServer(app);

import { getGame } from "../../shared/src/handlers/gameHandlers";
import { GameRoom, getRoom, roomHandler } from "../../shared/src/handlers/room";
import { uhandler } from "../../shared/src/handlers/usersHandler";
import { IUser, SocketUser } from "../../shared/src/types/users";
import { chatHandlerConnection } from "./connections/chatConnection";
import { gameHandlerConnection } from "./connections/gameConnection";
import { gamequeueHandlerConnection } from "./connections/gameQueueConnection";
import { userHandlerConnection } from "./connections/userConnection";
import { usersHandlerConnection } from "./connections/usersConnection";
import { db } from "./lib/db";

export const io = new Server<
     ServerToClientEvents,
     ClientToServerEvents,
     InterServerEvents,
     SocketData
>(server);

type InterServerEvents = {};

export const chatHandler: Namespace<
     ChatClientEvents,
     ChatServerEvents,
     DefaultEventsMap,
     SocketData
> = io.of("/chat");

chatHandler.on("connection", (socket) =>
     chatHandlerConnection(chatHandler, socket)
);

export const usersHandler: Namespace<
     UsersServerEvents,
     UsersClientEvents,
     DefaultEventsMap,
     SocketData
> = io.of("/users");

usersHandler.on("connection", (socket) =>
     usersHandlerConnection(usersHandler, socket)
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

export const getUserFromSocket = (socket: Socket): IUser | undefined => {
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

io.on("connection", (socket) =>
     gameHandlerConnection(io as unknown as MyIo, socket)
);
export const gameId = "a0s9df0a9sdjf";

export const getRoomId = (socket: Socket<any, any, any, any>) =>
     socket.handshake.auth["roomId"];

app.get("/conversation/:roomId", async (req, res) => {
     const conversationId = req.params.roomId;
     const { data } = await db
          .from("conversations")
          .select("*")
          .eq("id", conversationId)
          .single();
     if (!data)
          return res.status(500).json({
               message: "Conversation not found",
          });
     let users: any = await Promise.all([
          db.from("profiles").select("*").eq("id", data["user1"]).single(),
          db.from("profiles").select("*").eq("id", data["user2"]).single(),
     ]);
     users = users.map((user: { data: IUser }) => user.data);
     const messages = await db
          .from("messages")
          .select("*")
          .eq("conversationId", conversationId)
          .order("created");
     return res.json({
          id: data["id"],
          users: users,
          messages: messages.data,
     });
});

app.get("/user/:usernameorId", async (req, res) => {
     const username = req.params.usernameorId;
     let user: SocketUser | undefined = uhandler.getUser(username)?.user;
     if (!user) {
          const { data, error } = await db
               .from("profiles")
               .select("*")
               .eq("username", username)
               .single();
          if (!error) {
               uhandler.addUser({
                    socketId: "",
                    ...data,
               });
          }
     }
     res.send(uhandler.getUser(uhandler.getUserByUsername(username) as string));
});

app.get("/games/:roomId", (req, res) => {
     let room = getRoom(req.params.roomId);
     console.log("Room:", room);
     const gamename = req.query.gamename ?? "Rock Paper Scissors";
     console.table(req.query);
     if (!room) {
          roomHandler.createRoom<GameRoom>(
               req.params.roomId,
               new GameRoom(req.params.roomId, getGame(gamename))
          );
          room = getRoom(req.params.roomId);
          res.send(room);
          return;
     }
     res.send(room);
});
server.listen(3001, () => {
     console.log("listening on *:3001");
});
