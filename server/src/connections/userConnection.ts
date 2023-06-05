import { Namespace, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { getGame } from "../../../shared/src/handlers/gameHandlers";
import { GameRoom, roomHandler } from "../../../shared/src/handlers/room";
import { uhandler } from "../../../shared/src/handlers/usersHandler";
import { GameNames } from "../../../shared/src/types/game";
import {
     UserClientEvents,
     UserServerEvents,
} from "../../../shared/src/types/socketEvents";
import { SocketData } from "../../../shared/src/types/types";
import {
     GameInvite,
     GameInviteOptions,
     SocketUser,
     UserState,
} from "../../../shared/src/types/users";
import { db } from "../lib/db";
import { getUserFromSocket } from "../server";

export const userHandlerConnection = (
     userHandler: Namespace<
          UserServerEvents,
          UserClientEvents,
          DefaultEventsMap,
          SocketData
     >,
     socket: Socket<
          UserServerEvents,
          UserClientEvents,
          DefaultEventsMap,
          SocketData
     >
) => {
     const socketuser = getUserFromSocket(socket);
     const socketUser = {
          ...socketuser,
          socketId: socket.id,
     } as SocketUser;
     if (socketuser) {
          uhandler.addUser(socketUser);
          socket.data.user = socketuser;
          console.log("connecting", uhandler.getUser(socketuser.id));
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
          if (!user || !currentUser) {
               console.log(user);
               console.log(currentUser);
               return;
          }
          console.log(user, currentUser);

          const isFriend = await currentUser?.friends.getRequest(user.id);
          if (!isFriend) {
               await currentUser?.friends.addFriendRequest(user.id);
          }

          console.log("sending to friend");
          socket.to(user.user.socketId).emit("add_friend_response", {
               created_at: currentUser.user.created_at ?? "",
               id: currentUser.user.id,
               username: currentUser.user.username ?? "",
               email: currentUser.user.email ?? "",
          });
          socket.to(user.socketId).emit("add_friend_response", {
               created_at: currentUser.user.created_at ?? "",
               id: currentUser.user.id,
               username: currentUser.user.username ?? "",
               email: currentUser.user.email ?? "",
          });
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
     socket.on("update_user", (user) => {
          if (!user) return;
          uhandler.updateUser(user.id, {
               user: {
                    id: user.id,
                    socketId: user.socketId,
                    created_at: user.created_at ?? "",
                    email: user.email ?? "",
                    username: user.username ?? "",
               },
               socketId: user.socketId,
          });
          console.log(
               uhandler.getUser(user.id).socketId,
               uhandler.getUser(user.id).user.socketId,
               socket.id
          );
     });
     socket.on("game_invite", (gameName: GameNames, userId: string) => {
          const user = uhandler.getUser(userId);

          const mainUser = uhandler.getUser(
               getUserFromSocket(socket)?.id as string
          );
          console.log(user);
          console.log(uhandler.getUser(user.id));
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
<<<<<<< HEAD
          if (!gameInvite) return;
          userHandler.to(user.socketId).emit("game_invite", gameInvite);
=======
          if (!gameInvite) {
               console.log("game invite not created");
               return;
          }
          console.log("sending game invite");
          console.log(gameInvite);
          userHandler
               .to(user.user.socketId)
               .emit("game_invite", gameInvite, (data) => console.log(data));
          userHandler
               .to(user.socketId)
               .emit("game_invite", gameInvite, (data) => console.log(data));
>>>>>>> 8e02ec11482aa4e4c7e27cd19ffd90ea7c3d049a
     });
     socket.on(
          "game_invite_response",
          (
               action: GameInviteOptions,
               invite: GameInvite,
               callback: (invite: GameInvite) => void
          ) => {
               if (action == "accepted") {
                    const ninvite = uhandler.invites.acceptInvite(
                         invite.inviteId
                    );
                    if (!ninvite) return;
                    roomHandler.createRoom<GameRoom>(
                         ninvite?.roomId,
                         new GameRoom(
                              ninvite?.roomId,
                              getGame(ninvite?.gameName as GameNames)
                         )
                    );
                    const to = uhandler.getUser(ninvite.to.id);
                    const from = uhandler.getUser(ninvite.from.id);
                    console.log(to, from);
                    if (!to || !from) return;
                    userHandler
                         .to(from.socketId)
                         .emit("game_invite_accepted", ninvite);
                    userHandler
                         .to(to.socketId)
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
                    socketId: "",
               });
          }
     });
};
