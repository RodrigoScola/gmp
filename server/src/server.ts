import express from "express";
const app = express();
import http from "http";
const server = http.createServer(app);
import { Server } from "socket.io";
import { RockPaperScissorsChoice } from "../../web/types";
import { User } from "../../web/types";
import { RoomHandler } from "./game/room";
import { SocketEvents } from "../../web/types";
export const io = new Server<SocketEvents>(server, {});

export interface SocketUser extends User {
  socketId: string;
}

const r = new RoomHandler();
const getRoomId = (socket: any) => socket.handshake.auth["roomId"];
io.on("connection", (socket) => {
  const gameStr = socket.handshake.auth;

  var room = r.getRoom(getRoomId(socket));
  var game = room?.game;

  const handshakeInfo = {
    roomId: gameStr["roomId"] as string,
    user: gameStr["user"] as SocketUser,
  };
  handshakeInfo.user.socketId = socket.id;
  socket.on("join-room", async (roomId: string) => {
    r.addUserToRoom(roomId, handshakeInfo.user);

    console.log("player connected");
    socket.join(roomId);
    room = r.getRoom(getRoomId(socket));
    game = room?.game;
    game?.addPlayer({
      ...handshakeInfo.user,
    });
    // console.log(r.getRoom(roomId))

    io.to(roomId).emit("user-connected", roomId);
    if (game?.getPlayers().length == 2) {
      io.to(roomId).emit("start-game", game?.getPlayers());
    }
  });
  // player move
  socket.on("choice", (player: RockPaperScissorsChoice) => {
    // console.log(socket.handshake.query)
    // update game state
    // send game state to all players
    if (!player.choice) return;

    game?.addChoice(
      {
        choice: player.choice,
        id: player.id,
      },
      player.choice
    );

    const roundWinner = game?.hasRoundWinner();
    console.log(roundWinner);
    if (roundWinner) {
      io.to(getRoomId(socket)).emit("round-winner", roundWinner);
      game?.newRound();
      if (game?.hasGameWin()) {
        io.to(getRoomId(socket)).emit("game-winner", game.hasGameWin());
      } else {
        setTimeout(() => {
          io.to(getRoomId(socket)).emit("new-round");
        }, 10);
      }
    }

    io.to(getRoomId(socket)).emit("choice", {
      id: player.id,
      choice: player.choice,
    });

    // console.log(r.rooms)
  });

  socket.on("disconnect", () => {
    io.in(getRoomId(socket)).emit("user-disconnected", getRoomId(socket));
    r.rooms.delete(getRoomId(socket));
    io.in(getRoomId(socket)).socketsLeave(getRoomId(socket));
    console.log("user disconnected");
  });
});

server.listen(3001, () => {
  console.log("listening on *:3001");
});
