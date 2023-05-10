import express from "express";
const app = express();
import http from "http";
const server = http.createServer(app);
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Game, GameNames } from "../../web/types";
import { User } from "../../web/types";

import { ServerToClientEvents, ClientToServerEvents } from "../../web/types";

import { roomHandler } from "./handlers/room";
import { MatchHandler, MatchPlayerState } from "./handlers/Handlers";
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

export const getRoomId = (socket: MySocket) => socket.handshake.auth["roomId"];

io.on("connection", (socket: MySocket) => {
  const gameStr = socket.handshake.auth;
  var room = roomHandler.getRoom(getRoomId(socket));
  if (!room) {
    const Games = getGame(gameStr["gameName"] as GameNames);
    if (!Games) return;
    room = roomHandler.createRoom(getRoomId(socket), [], Games);
  }
  var game: Game;
  if (room?.match?.game) {
    game = room.match.game;
  }

  const connInfo = {
    roomId: socket.handshake.auth["roomId"] as string,
    user: {
      ...socket.handshake.auth["user"],
      socketId: socket.id,
    },
  };
  // console.log(socket.handshake.auth["user"]);
  socket.on("join_room", async (roomId: string) => {
    roomHandler.addUserToRoom(roomId, connInfo.user);
    // console.log(room);
    socket.join(roomId);
    room = roomHandler.getRoom(getRoomId(socket));

    if (room?.match?.game) {
      game = room.match.game;
    }
    room?.match.addPlayer(connInfo.user);

    io.to(roomId).emit("get_players", game!.getPlayers());
  });
  socket.on("get_state", (callback) => {
    callback(game.getState());
  });
  socket.on("player_ready", () => {
    // if (game?.isReady()) {
    io.to(getRoomId(socket)).emit("start_game");
    room?.match.playGame(io, socket, game);
    // }
  });

  socket.on("rematch", (callback) => {
    // check if other player has rematched

    if (callback) {
      callback();
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
