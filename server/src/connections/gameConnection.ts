import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { GameNames, IGame } from "../../../shared/types/game";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../../../shared/types/socketEvents";
import { SocketUser, UserGameState } from "../../../shared/types/users";
import {
  MatchPlayerState,
  getGame,
} from "../../../shared/handlers/gameHandlers";
import { GameRoom, roomHandler } from "../../../shared/handlers/room";
import { uhandler } from "../../../shared/handlers/usersHandler";
import { SocketData, getRoomId } from "../server";
import { Socket } from "socket.io";
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

export const gameHandlerConnection = (io: MyIo, socket: MySocket) => {
  console.log("connected");
  // TODO:change it to be in socket.data
  const gameStr = socket.handshake.auth;
  var room = roomHandler.getRoom(getRoomId(socket)) as GameRoom;
  // console.log(roomHandler);
  // if (!room) {
  //   const Games = getGame(gameStr["gameName"] as GameNames);
  //   if (!Games) return;
  //   room = roomHandler.createRoom<GameRoom>(
  //     getRoomId(socket),
  //     new GameRoom(getRoomId(socket), Games)
  //   );
  // }
  var game: IGame;

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
    try {
      roomHandler.addUserToRoom(roomId, connInfo.user);
    } catch (e) {
      const Games = getGame(gameStr["gameName"] as GameNames);
      if (!Games) return;
      room = roomHandler.createRoom<GameRoom>(
        getRoomId(socket),
        new GameRoom(getRoomId(socket), Games)
      );
      roomHandler.addUserToRoom(roomId, connInfo.user);
    }
    // console.log(room);
    socket.join(roomId);
    const hasRoom = roomHandler.getRoom<GameRoom>(getRoomId(socket));
    if (hasRoom) {
      room = hasRoom;
    }

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
    const roomId = getRoomId(socket);
    io.to(roomId).emit("start_game");
    room.users.getUsers().forEach((user: SocketUser) => {
      uhandler.updateUser(user.id, {
        game: {
          state: UserGameState.playing,
          gameId: roomId,
        },
      });
    });
    room?.match.playGame(io, socket, game);
    // }
  });

  socket.on("rematch", (_) => {
    // check if other player has rematched
    console.log(
      room?.match.players.getPlayer(connInfo.user.id).state ==
        MatchPlayerState.playing
    );
    room?.match.changePlayerState(
      connInfo.user.id,
      MatchPlayerState.waiting_rematch
    );
    console.log(room?.match.canRematch());
    if (room?.match.canRematch()) {
      console.log("rematchh");
      const state = room?.match.rematch();

      io.to(getRoomId(socket)).emit("rematch_accept", state);
    } else {
      socket.broadcast.to(getRoomId(socket)).emit("rematch");
    }
  });
  socket.on("disconnecting", () => {
    const roomId = getRoomId(socket);
    io.in(roomId).emit("user_disconnected", roomId);
    io.in(roomId).socketsLeave(roomId);
    roomHandler.deleteRoom(roomId);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
};
