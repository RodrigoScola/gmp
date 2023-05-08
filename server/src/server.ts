import express from "express";
const app = express();
import http from "http";
const server = http.createServer(app);
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import {
  Game,
  GameNames,
  GameType,
  RockPaperScissorsChoice,
} from "../../web/types";
import { User } from "../../web/types";
import { Room, RoomHandler } from "./handlers/room";
import { ServerToClientEvents, ClientToServerEvents } from "../../web/types";
import { TicTacToeGame } from "./game/TicTacToeGame";
import { RockPaperScissorsGame } from "./game/rockpaperScissors";
import { roomHandler } from "./handlers/room";
import { GameHandler, games } from "./handlers/Handlers";
import { getGame } from "./handlers/Handlers";
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

io.on("connection", (socket) => {
  const gameStr = socket.handshake.auth;
  var room = roomHandler.getRoom(getRoomId(socket));
  if (!room) {
    // console.log(gameStr);
    const Games = getGame(gameStr["gameName"] as GameNames);
    if (Games) {
      room = roomHandler.createRoom(getRoomId(socket), [], new Games());
    }
  }

  var game: Game | null = room?.game;
  const connInfo = {
    roomId: socket.handshake.auth["roomId"] as string,
    user: {
      ...socket.handshake.auth["user"],
      socketId: socket.id,
    },
  };
  connInfo.user = connInfo.user as SocketUser;
  socket.on("join_room", async (roomId: string) => {
    roomHandler.addUserToRoom(roomId, connInfo.user);
    socket.join(roomId);
    room = roomHandler.getRoom(getRoomId(socket));
    game = room?.game;
    game?.addPlayer(connInfo.user);

    io.to(roomId).emit("get_players", game?.getPlayers());
    // console.log("gampe");
    // console.log(game.getPlayers());
  });
  socket.on("player_ready", () => {
    if (game?.isReady()) {
      gameHandler.playGame(io, socket, game);
    }
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
