import express from "express";
const app = express();
import http from "http";
const server = http.createServer(app);
import { Server, Socket, Namespace } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import {
  ChatClientEvents,
  ChatServerEvents,
  Game,
  GameInvite,
  GameInviteOptions,
  GameNames,
  SocketUser,
  UserGameState,
} from "../../web/types";
import { User } from "../../web/types";

import { ServerToClientEvents, ClientToServerEvents } from "../../web/types";

import { ChatRoom, GameRoom, roomHandler } from "./handlers/room";
import { MatchPlayerState, getGame } from "./handlers/Handlers";
import { uhandler } from "./handlers/usersHandler";
import { getRoom } from "./handlers/room";
import { RockPaperScissorsGame } from "./game/rockpaperScissors";
export const io = new Server<
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData
>(server);

type InterServerEvents = {};

type SocketData = {
  user: User;
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

const chatHandler: Namespace<
  ChatClientEvents,
  ChatServerEvents,
  DefaultEventsMap,
  SocketData
> = io.of("/chat");

const userHandler: Namespace<
  ChatClientEvents,
  ChatServerEvents,
  DefaultEventsMap,
  SocketData
> = io.of("/user");

const getUserFromSocket = (socket: MySocket): User | undefined => {
  const u = socket.handshake.auth["user"];
  if (!u) {
    return;
  }
  return u as User;
};
userHandler.on("connection", (socket) => {
  const user = getUserFromSocket(socket);
  const socketUser = {
    ...user,
    socketId: socket.id,
  } as SocketUser;

  uhandler.addUser(socketUser);
  if (user) {
    socket.data.user = user;
  }
  socket.on("game_invite", (gameName: GameNames, userId: string) => {
    const user = uhandler.getUser(userId);
    const mainUser = uhandler.getUser(getUserFromSocket(socket)?.id as string);
    console.log("asdf");
    if (!user || !mainUser) return;

    const gameInvite = uhandler.invites.addInvite(
      mainUser.user,
      user.user,
      gameName
    );
    if (!gameInvite) return;
    console.log(gameInvite);
    userHandler.to(user.socketId).emit("game_invite", gameInvite);
  });
  socket.on(
    "game_invite_response",
    (
      action: GameInviteOptions,
      invite: GameInvite,
      callback: (invite: GameInvite) => void
    ) => {
      if (action == "accepted") {
        const ninvite = uhandler.invites.acceptInvite(invite.inviteId);
        roomHandler.createRoom<GameRoom>(
          ninvite?.roomId,
          new GameRoom(ninvite?.roomId, getGame(ninvite?.gameName as GameNames))
        );
        if (!ninvite) return;
        userHandler
          .to(uhandler.getUser(ninvite.to.id)?.socketId)
          .emit("game_invite_accepted", ninvite);
        userHandler
          .to(uhandler.getUser(ninvite.from.id)?.socketId)
          .emit("game_invite_accepted", ninvite);
        callback(invite);
      } else if (action == "declined") {
      }
    }
  );
});

chatHandler.on("connection", (socket) => {
  var room: ChatRoom;
  socket.on("join_room", (roomId) => {
    const connInfo = {
      roomId: socket.handshake.auth["roomId"] as string,
      user: {
        ...socket.handshake.auth["user"],
        socketId: socket.id,
      },
    };
    try {
      roomHandler.addUserToRoom(roomId, connInfo.user);

      room = roomHandler.getRoom<ChatRoom>(getRoomId(socket)) as ChatRoom;
    } catch (e) {
      room = roomHandler.createRoom<ChatRoom>(
        getRoomId(socket),
        new ChatRoom(getRoomId(socket))
      );
      roomHandler.addUserToRoom(roomId, connInfo.user);
      room = roomHandler.getRoom<ChatRoom>(getRoomId(socket)) as ChatRoom;
    }
    if (room) {
      chatHandler.to(roomId).emit("user_joined", room.users.getUsers());
    }
    socket.join(roomId);

    const hasRoom = roomHandler.getRoom<ChatRoom>(getRoomId(socket));
    if (hasRoom) {
      room = hasRoom;
    }
  });
  socket.on("state_change", (state) => {
    socket.broadcast.to(getRoomId(socket)).emit("state_change", state);
  });
  socket.on("send_message", (message) => {
    const nmessage = room.messages.newMessage(message.userId, message.message);
    console.log(room.messages);
    room.messages.addMessage(nmessage);
    console.log(room.messages);
    chatHandler.to(getRoomId(socket)).emit("receive_message", nmessage);
  });
});

export const getRoomId = (socket: MySocket) => socket.handshake.auth["roomId"];

io.on("connection", (socket: MySocket) => {
  // TODO:change it to be in socket.data
  const gameStr = socket.handshake.auth;
  var room = roomHandler.getRoom(getRoomId(socket)) as GameRoom;
  console.log(roomHandler);
  // if (!room) {
  //   const Games = getGame(gameStr["gameName"] as GameNames);
  //   if (!Games) return;
  //   room = roomHandler.createRoom<GameRoom>(
  //     getRoomId(socket),
  //     new GameRoom(getRoomId(socket), Games)
  //   );
  // }
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

  socket.on("rematch", (callback) => {
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
