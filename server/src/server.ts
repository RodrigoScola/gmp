import express from "express";
const app = express();
import http from "http";
const server = http.createServer(app);
import { Server } from "socket.io";
import { usersHandlers } from "./handlers/usersHandler";
import { GameType, RockPaperScissorsChoice } from "../../web/types";
import { User } from "../../web/types";
import { Room, RoomHandler } from "./handlers/room";
import { ServerToClientEvents, ClientToServerEvents } from "../../web/types";
import { TicTacToeGame } from "./game/TicTacToeGame";
import { RockPaperScissorsGame } from "./game/rockpaperScissors";
import { roomHandler } from "./handlers/room";
import { GameHandler } from "./handlers/GameHandler";
export const io = new Server<ServerToClientEvents, ClientToServerEvents>(
  server
);

export interface SocketUser extends User {
  socketId: string;
}
export type MyIo = Server<
  ServerToClientEvents,
  ClientToServerEvents,
  DefaultEventsMap,
  any
>;

export type MySocket = Socket<
  ServerToClientEvents,
  ClientToServerEvents,
  DefaultEventsMap,
  any
>;

const gameHandler = new GameHandler();

export const getRoomId = (socket) => socket.handshake.auth["roomId"];

io.on("connection", (socket: MySocket) => {
  const gameStr = socket.handshake.auth;
  var room = roomHandler.getRoom(getRoomId(socket));
  var game = room?.game;
  const connInfo = {
    roomId: gameStr["roomId"] as string,
    user: { ...gameStr["user"], socketId: socket.id } as SocketUser,
  };
  usersHandlers.addUser(connInfo.user);

  socket.on("join_room", async (roomId: string) => {
    roomHandler.addUserToRoom(roomId, connInfo.user);
    socket.join(roomId);
    room = roomHandler.getRoom(getRoomId(socket));
    game = room?.game;
    game?.addPlayer(usersHandlers.getUser(connInfo.user.id));
    io.to(roomId).emit("user_connected", roomId);
  });
  socket.on("start_game", () => {
    if (game.isReady()) {
      console.log(game?.name);
      gameHandler.playGame(io, socket, game);
      io.to(getRoomId(socket)).emit("start_game", game?.getPlayers());
    } else {
      console.log("is not ready");
    }
    console.log("start game");
  });

  socket.on("disconnect", () => {
    const roomId = getRoomId(socket);
    io.in(roomId).emit("user_disconnected", roomId);
    io.in(roomId).socketsLeave(roomId);
    roomHandler.deleteRoom(roomId);

    console.log("user disconnected");
  });
});

server.listen(3001, () => {
  console.log("listening on *:3001");
});
