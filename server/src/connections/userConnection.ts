import { Namespace, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { SocketData, getUserFromSocket } from "../server";
import {
  UserClientEvents,
  UserServerEvents,
} from "../../../shared/types/socketEvents";
import {
  GameInvite,
  GameInviteOptions,
  SocketUser,
  UserState,
} from "../../../shared/types/users";
import { uhandler } from "../../../shared/handlers/usersHandler";
import { GameRoom, roomHandler } from "../../../shared/handlers/room";
import { getGame } from "../../../shared/handlers/gameHandlers";
import { GameNames } from "../../../shared/types/game";
import { db } from "../lib/db";

export const userHandlerConnection = (
  userHandler: Namespace<
    UserServerEvents,
    UserClientEvents,
    DefaultEventsMap,
    SocketData
  >,
  socket: Socket<
    UserClientEvents,
    UserServerEvents,
    DefaultEventsMap,
    SocketData
  >
) => {
  const socketuser = getUserFromSocket(socket);
  const socketUser = {
    ...socketuser,
    socketId: socket.id,
  } as SocketUser;
  uhandler.addUser(socketUser);
  if (socketuser) {
    socket.data.user = socketuser;
  }
  socket.on("get_friends", async (userid: string, callback) => {
    const user = uhandler.getUser(userid);

    if (!user) return;

    const friends = await user.friends.getFriends();

    callback(friends);
  });

  socket.on("add_friend", async (friendId: string, _) => {
    // console.log(friendId);
    const user = uhandler.getUser(friendId);

    const currentUser = uhandler.getUser(
      getUserFromSocket(socket)?.id as string
    );

    if (!user || !currentUser?.user) return;
    const isFriend = await currentUser?.friends.getRequest(user.id);

    if (!isFriend) {
      await currentUser?.friends.addFriendRequest(user.id);
    }
    if (isFriend?.status == "pending") {
      socket.to(user?.socketId).emit("add_friend_response", {
        created_at: currentUser.user.created_at ?? "",
        id: currentUser.user.id,
        username: currentUser.user.username ?? "",
        email: currentUser.user.email ?? "",
      });
    }
  });

  socket.on("add_friend_answer", async (user, response) => {
    if (response == "accepted") {
      const currentUser = uhandler.getUser(
        getUserFromSocket(socket)?.id as string
      );
      if (!currentUser?.user) return;
      const reqId = await currentUser.friends.getRequest(user.id);
      const { data } = await db
        .from("connections")
        .update({
          status: "accepted",
        })
        .eq("id", reqId?.id)
        .single();

      console.log(data);
      // const a = await db
      //   .from("connections")
      //   .update({ status: "accepted" })
      //   .eq("id", accepted?.id);
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
      {
        id: mainUser.user.id,
        created_at: mainUser.user.created_at ?? "",
        email: mainUser.user.email ?? "",
        username: mainUser.user.username ?? "",
      },
      {
        created_at: user.user.created_at ?? "",
        email: user.user.email ?? "",
        id: user.user.id,
        username: user.user.username ?? "",
      },
      gameName
    );
    if (!gameInvite) return;
    // console.log(gameInvite);
    // console.log(user.socketId);
    userHandler
      .to(user.user.socketId)
      .emit("game_invite", gameInvite.gameName, mainUser.user.id);
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
        console.log(to, from);
        if (!to || !from) return;
        console.log("this ga");
        userHandler.to(to.user.socketId).emit("game_invite_accepted", ninvite);
        userHandler.to(to.socketId).emit("game_invite_accepted", ninvite);
        userHandler.to(from.socketId).emit("game_invite_accepted", ninvite);
        userHandler
          .to(from.user.socketId)
          .emit("game_invite_accepted", ninvite);
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