import { Namespace, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { SocketData, getUserFromSocket } from "../server";
import {
  ChatClientEvents,
  ChatServerEvents,
} from "../../../web/types/socketEvents";
import {
  GameInvite,
  GameInviteOptions,
  SocketUser,
  UserState,
} from "../../../web/types/users";
import { uhandler } from "../handlers/usersHandler";
import { GameRoom, roomHandler } from "../handlers/room";
import { getGame } from "../handlers/Handlers";
import { GameNames } from "../../../web/types/game";

export const userHandlerConnection = (
  userHandler: Namespace<
    ChatClientEvents,
    ChatServerEvents,
    DefaultEventsMap,
    SocketData
  >,
  socket: Socket<
    ChatClientEvents,
    ChatServerEvents,
    DefaultEventsMap,
    SocketData
  >
) => {
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
  socket.on("add_friend", async (friendId: string, _) => {
    // console.log(friendId);
    const user = uhandler.getUser(friendId);

    if (!user) return;

    const currentUser = uhandler.getUser(
      getUserFromSocket(socket)?.id as string
    );

    const isFriend = await currentUser?.friends.isFriend(user.id);
    console.log(isFriend);
    // add to database as pending

    // socket.to(user?.socketId).emit("friend_request", "hello there", () => {});
  });

  socket.on("add_friend_response", async (response) => {
    if (response == "accepted") {
      // change definition to accepted
    } else {
      // change definition to declined
    }
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
        if (!ninvite) return;
        roomHandler.createRoom<GameRoom>(
          ninvite?.roomId,
          new GameRoom(ninvite?.roomId, getGame(ninvite?.gameName as GameNames))
        );
        const to = uhandler.getUser(ninvite.to.id);
        const from = uhandler.getUser(ninvite.from.id);
        if (!to || !from) return;
        userHandler.to(to.socketId).emit("game_invite_accepted", ninvite);
        userHandler.to(from.socketId).emit("game_invite_accepted", ninvite);
        callback(invite);
      } else if (action == "declined") {
      }
    }
  );

  socket.on("disconnect", () => {
    if (socket.data.user) {
      uhandler.updateUser(socket.data.user?.id, {
        currentState: UserState.offline,
      });
    }
  });
};
