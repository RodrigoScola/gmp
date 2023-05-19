import express from "express";
const app = express();
import http from "http";
const server = http.createServer(app);
import { Server, Socket, Namespace } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import {
  ChatClientEvents,
  ChatServerEvents,
  ChatUser,
  ChatUserState,
  CurrentUserState,
  Game,
  GameInvite,
  GameInviteOptions,
  GameNames,
  GameQueueClientEvents,
  GameQueueServerEvents,
  GameType,
  SocketUser,
  UserGameState,
  IUser,
} from "../../web/types";
import { ServerToClientEvents, ClientToServerEvents } from "../../web/types";
import { ChatRoom, GameRoom, QueueRoom, roomHandler } from "./handlers/room";
import { MatchPlayerState, getGame } from "./handlers/Handlers";
import { uhandler } from "./handlers/usersHandler";
import { getRoom } from "./handlers/room";
import { gameQueue } from "./matchQueue";
export const io = new Server<
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData
>(server);

type InterServerEvents = {};

type SocketData = {
  user: IUser;
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

const getUserFromSocket = (socket: MySocket): IUser | undefined => {
  const u = socket.handshake.auth["user"];
  if (!u) {
    return;
  }
  return u as IUser;
};
type QueueSocketData = {
  userId: string;
};
const gamequeueHandler: Namespace<
  GameQueueClientEvents,
  GameQueueServerEvents,
  DefaultEventsMap,
  QueueSocketData
> = io.of("/gamequeue");

export const gameId = "a0s9df0a9sdjf";
gamequeueHandler.on("connection", (socket) => {
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
        gameRoom.addUser(user);
        const roomUser = room.users.getUser(player.id as string);

        gamequeueHandler.to(roomUser?.socketId).emit("game_found", gameId);
        gameQueue.removePlayer(player);
        room.users.deleteUser(user?.id as string);
      });
    }
  });
  socket.on("disconnect", () => {
    gameQueue.removePlayer(connInfo.user.id);
  });
});

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
  // console.log(socketUser.socketId);

  // socket.on("friend_invite")
  // socket.on("friend_invite_response")
  socket.on("add_friend", (friendId: string, callback) => {
    console.log(friendId);
    const user = uhandler.getUser(friendId);

    if (!user) return;

    socket.to(user?.socketId).emit("friend_request", "hello there", () => {});
  });

  socket.on("add_friend_response", async (response) => {
    console.log(response);
    // add to supabase
  });

  socket.on("game_invite", (gameName: GameNames, userId: string) => {
    const user = uhandler.getUser(userId);

    const mainUser = uhandler.getUser(getUserFromSocket(socket)?.id as string);

    if (!user || !mainUser) return;

    const gameInvite = uhandler.invites.addInvite(
      mainUser.user,
      user.user,
      gameName
    );
    if (!gameInvite) return;
    // console.log(gameInvite);
    // console.log(user.socketId);
    userHandler.to(user.user.socketId).emit("game_invite", gameInvite);
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

  socket.on("disconnect", () => {
    if (socket.data.user) {
      uhandler.updateUser(socket.data.user?.id, {
        currentState: CurrentUserState.offline,
      });
    }
  });
});
chatHandler.on("connection", (socket) => {
  var room: ChatRoom;
  socket.on("join_room", async (roomId) => {
    const connInfo = {
      roomId: socket.handshake.auth["roomId"] as string,
      user: {
        ...socket.handshake.auth["user"],
        socketId: socket.id,
      },
    };
    try {
      roomHandler.addUserToRoom<ChatUser>(roomId, {
        id: connInfo.user.id,
        state: ChatUserState.online,
        socketId: connInfo.user.socketId,
      });
      room = roomHandler.getRoom<ChatRoom>(getRoomId(socket)) as ChatRoom;
    } catch (e) {
      room = roomHandler.createRoom<ChatRoom>(
        getRoomId(socket),
        new ChatRoom(getRoomId(socket))
      );
      await room.getConversation();
      roomHandler.addUserToRoom<ChatUser>(roomId, {
        id: connInfo.user.id,
        state: ChatUserState.online,
        socketId: connInfo.user.socketId,
      });
      socket.data.roomId = roomId;

      room = roomHandler.getRoom<ChatRoom>(getRoomId(socket)) as ChatRoom;
    }
    if (room) {
      chatHandler.to(roomId).emit("user_joined", room.users.getUsers());
    }
    // console.log(room);
    socket.join(roomId);
    // console.log(uhandler.getUser(connInfo.user.id));
    // console.log(connInfo.user.socketId);

    const hasRoom = roomHandler.getRoom<ChatRoom>(getRoomId(socket));
    if (hasRoom) {
      room = hasRoom;
    }
  });
  socket.on("state_change", (state) => {
    if (!room && socket.data.roomId) {
      room = roomHandler.getRoom<ChatRoom>(socket.data.roomId) as ChatRoom;
    }
    if (!room?.users) return;

    room.users.updateUser(getUserFromSocket(socket)?.id as string, {
      state,
    });
    socket.broadcast
      .to(getRoomId(socket))
      .emit(
        "state_change",
        room.users.users.get(getUserFromSocket(socket)?.id as string)
      );
  });
  socket.on("send_message", (message, callback) => {
    if (socket.data.roomId) {
      room = roomHandler.getRoom<ChatRoom>(socket.data.roomId) as ChatRoom;
    }

    const nmessage = room?.messages?.newMessage(
      message.userId,
      message.message
    );
    const conversationUsers = room.messages.users;
    const users = room.users.getUsers();

    conversationUsers.forEach((user) => {
      const muser = uhandler.getUser(user.id);
      const inChannel = room.users.users.has(user.id);
      if (!inChannel && muser) {
        userHandler.to(muser.user.socketId).emit("notification_message", {
          user: uhandler.getUser(message.userId)?.user as SocketUser,
        });
      }
    });
    users.forEach((user) => {
      chatHandler.to(user.socketId).emit("receive_message", nmessage);
      // console.log(user.socketId);
    });
    room.messages.addMessage(nmessage);
    if (callback) {
      callback({
        received: true,
      });
    }
  });
  socket.on("disconnecting", () => {
    if (room) {
      room.users.deleteUser(getUserFromSocket(socket)?.id as string);
    }
  });
});

export const getRoomId = (socket: MySocket) => socket.handshake.auth["roomId"];

io.on("connection", (socket: MySocket) => {
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
