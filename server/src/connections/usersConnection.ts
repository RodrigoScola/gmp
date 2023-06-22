import { Namespace, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { uhandler } from "../../../shared/src/handlers/usersHandler";
import {
     UsersClientEvents,
     UsersServerEvents,
} from "../../../shared/src/types/socketEvents";
import { SocketData } from "../../../shared/src/types/types";
import { SocketUser, UserState } from "../../../shared/src/types/users";
import { db } from "../lib/db";
import { getUserFromSocket } from "../server";

export const usersHandlerConnection = (
     _: Namespace<
          UsersServerEvents,
          UsersClientEvents,
          DefaultEventsMap,
          SocketData
     >,
     socket: Socket<
          UsersServerEvents,
          UsersClientEvents,
          DefaultEventsMap,
          SocketData
     >
) => {
     const socketuser = getUserFromSocket(socket);
     const socketUser = {
          ...socketuser,
          socketId: socket.id,
     } as SocketUser;

     const hasUser = uhandler.getUser(socketuser?.id as string);
     if (!hasUser) {
          uhandler.addUser(socketUser);
     }
     if (socketuser) {
          socket.data.user = socketuser;
     }
     socket.on("get_user", (userId, callback) => {
          const user = uhandler.getUser(userId);
          if (!user) return;
          callback({
               created_at: user.user.created_at ?? "",

               email: user.user.email ?? "",
               id: user.user.id ?? userId,
               username: user.user.username ?? "",
               status: user.currentState ?? UserState.offline,
          });
     });
     socket.on("search_users", async (username: string, callback) => {
          const users = await db
               .from("profiles")
               .select("*")
               .ilike("username", `%${username}%`);

          if (callback) {
               callback(users.data);
          }
     });
     socket.on("get_friends", async (userId, callback) => {
          const user = uhandler.getUser(userId);
          const friends = await user.friends.getFriends();

          callback(friends);
     });
     socket.on("disconnect", () => {
          if (socket.data.user) {
               uhandler.updateUser(socket.data.user?.id, {
                    currentState: UserState.offline,
               });
          }
     });
};
