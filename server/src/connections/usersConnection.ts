import { Namespace, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { getUserFromSocket } from "../server";
import {
  UsersClientEvents,
  UsersServerEvents,
} from "../../../shared/src/types/socketEvents";
import { SocketUser, UserState } from "../../../shared/src/types/users";
import { uhandler } from "../../../shared/src/handlers/usersHandler";
import { db } from "../lib/db";
import { SocketData } from "../../../shared/src/types/types";

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
