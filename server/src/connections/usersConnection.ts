import { Namespace, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { SocketData, getUserFromSocket } from "../server";
import {
  UsersClientEvents,
  UsersServerEvents,
} from "../../../web/types/socketEvents";
import { SocketUser, UserState } from "../../../web/types/users";
import { uhandler } from "../handlers/usersHandler";
import { db } from "../lib/db";

export const usersHandlerConnection = (
  usersHandler: Namespace<
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
  uhandler.addUser(socketUser);
  if (socketuser) {
    socket.data.user = socketuser;
  }
  socket.on("search_users", async (username: string, callback) => {
    console.log("ad");
    const users = await db
      .from("profiles")
      .select("*")
      .ilike("username", `%${username}%`);

    console.log(users);
    if (callback) {
      callback(users.data);
    }
  });
  socket.on("disconnect", () => {
    if (socket.data.user) {
      uhandler.updateUser(socket.data.user?.id, {
        currentState: UserState.offline,
      });
    }
  });
};
