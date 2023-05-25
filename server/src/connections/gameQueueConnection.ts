import { Namespace, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { GameNames, GameType } from "../../../shared/types/game";
import { getGame } from "../../../shared/handlers/gameHandlers";
import {
  GameRoom,
  QueueRoom,
  roomHandler,
} from "../../../shared/handlers/room";
import { uhandler } from "../../../shared/handlers/usersHandler";
import { gameQueue } from "../matchQueue";
import { SocketData, gameId, getUserFromSocket } from "../server";
import {
  GameQueueClientEvents,
  GameQueueServerEvents,
} from "../../../shared/types/socketEvents";

export const gamequeueHandlerConnection = (
  gamequeueHandler: Namespace<
    GameQueueClientEvents,
    GameQueueServerEvents,
    DefaultEventsMap,
    SocketData
  >,
  socket: Socket<
    GameQueueClientEvents,
    GameQueueServerEvents,
    DefaultEventsMap,
    SocketData
  >
) => {
  const connInfo = {
    roomId: socket.handshake.auth["roomId"] as string,
    user: {
      ...socket.handshake.auth["user"],
      socketId: socket.id,
    },
  };

  socket.on("join_queue", (games: GameType | GameType[]) => {
    if (!roomHandler.roomExists("queueroom")) {
      roomHandler.createRoom<QueueRoom>(
        "queueroom",
        new QueueRoom("queueroom")
      );
    }
    const room = roomHandler.getRoom<QueueRoom>("queueroom") as QueueRoom;
    if (!room) {
      return;
    }
    let user = uhandler.getUser(getUserFromSocket(socket)?.id as string);
    if (!user) {
      user = uhandler.addUser(connInfo.user);
    }

    room.addUser({
      games: games,
      id: user.id,
      socketId: connInfo.user.socketId,
    });
    gameQueue.addPlayer({
      games: games,
      id: user.id,
    });
    if (!user) return;
    const match = gameQueue.findMatch(user.id);
    if (!match) return;
    const players = gameQueue.matchPlayer(match);
    if (players) {
      const gameRoom = roomHandler.createRoom<GameRoom>(
        gameId,
        new GameRoom(gameId, getGame(match.gameName as GameNames))
      );
      players.forEach((player) => {
        const user = uhandler.getUser(player.id);
        if (!user) return;
        gameRoom.addUser(user);
        const roomUser = room.users.getUser(player.id as string);
        if (!roomUser) return;
        gamequeueHandler.to(roomUser?.socketId).emit("game_found", gameId);
        gameQueue.removePlayer(player);
        room.users.deleteUser(user?.id as string);
      });
    }
  });
  socket.on("disconnect", () => {
    gameQueue.removePlayer(connInfo.user.id);
  });
};