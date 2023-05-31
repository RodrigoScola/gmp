import { Namespace, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { GameNames, GameType } from "../../../shared/src/types/game";
import { getGame } from "../../../shared/src/handlers/gameHandlers";
import {
     GameRoom,
     QueueRoom,
     roomHandler,
} from "../../../shared/src/handlers/room";
import { MainUser, uhandler } from "../../../shared/src/handlers/usersHandler";
import { gameQueue } from "../../../shared/src/handlers/matchQueue";
import { getUserFromSocket } from "../server";
import {
     GameQueueClientEvents,
     GameQueueServerEvents,
} from "../../../shared/src/types/socketEvents";
import { SocketData } from "../../../shared/src/types/types";
import { getGameData } from "../../../shared/src/game/gameUtils";

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
          user = uhandler.getUser(
               getUserFromSocket(socket)?.id as string
          ) as MainUser;
          room.addUser({
               games: games,
               id: user.id,
               socketId: connInfo.user.socketId,
          });

          gameQueue.addPlayer({
               games: games,
               id: user.id,
          });
          gamequeueHandler.emit("state_change", {
               length: gameQueue.players.length,
          });
          console.log(gameQueue.players);
          if (!user) return;
          const match = gameQueue.findMatch(user.id);
          if (!match) return;
          const players = gameQueue.matchPlayer(match);
          if (players) {
               const { id: matchId } = gameQueue.newMatch(
                    getGameData(match.gameName),
                    match.players
               );
               const gameRoom = roomHandler.createRoom<GameRoom>(
                    matchId,
                    new GameRoom(matchId, getGame(match.gameName as GameNames))
               );
               players.forEach((player) => {
                    const user = uhandler.getUser(player.id);
                    if (!user) return;
                    gameRoom.addUser(user);
                    const roomUser = room.users.getUser(player.id as string);
                    if (!roomUser) return;
                    gamequeueHandler
                         .to(roomUser?.socketId)
                         .emit("game_found", matchId);
                    gameQueue.removePlayer(player);
                    room.users.deleteUser(user?.id as string);
               });
          }
     });
     socket.on("get_state", (callback) => {
          console.log(gameQueue.players.length);
          callback({
               length: gameQueue.players.length,
          });
     });
     socket.on("disconnecting", () => {
          console.log("disco");

          gameQueue.removePlayer(connInfo.user.id);

          console.log(gameQueue.players);
          console.log(gameQueue.players.hasPlayer(connInfo.user.id));
          console.log(gameQueue.players.length);
          socket.emit("state_change", {
               length: gameQueue.players.length,
          });
     });
     socket.on("disconnect", () => {});
};
