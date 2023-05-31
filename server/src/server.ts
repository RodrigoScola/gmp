import express from "express";
const app = express();
import http from "http";
const server = http.createServer(app);
import { Server, Namespace, Socket } from "socket.io";
import { MySocket, SocketData } from "../../shared/src/types/types";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import {
     ServerToClientEvents,
     ChatClientEvents,
     ChatServerEvents,
     GameQueueClientEvents,
     GameQueueServerEvents,
     ClientToServerEvents,
     UsersServerEvents,
     UsersClientEvents,
} from "../../shared/src/types/socketEvents";

import { getRoom } from "../../shared/src/handlers/room";
import { IUser, SocketUser } from "../../shared/src/types/users";
import { chatHandlerConnection } from "./connections/chatConnection";
import { userHandlerConnection } from "./connections/userConnection";
import { gamequeueHandlerConnection } from "./connections/gameQueueConnection";
import { db } from "./lib/db";
import { uhandler } from "../../shared/src/handlers/usersHandler";
import { usersHandlerConnection } from "./connections/usersConnection";
import { gameHandlerConnection } from "./connections/gameConnection";

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

io.on("connection", (socket) => gameHandlerConnection(io, socket));
export const gameId = "a0s9df0a9sdjf";

export const getRoomId = (socket: MySocket) => socket.handshake.auth["roomId"];

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
