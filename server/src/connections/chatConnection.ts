import { Namespace, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import {
  ChatClientEvents,
  ChatServerEvents,
} from "../../../shared/src/types/socketEvents";
import { getRoomId, getUserFromSocket, userHandler } from "../server";
import { ChatRoom, getRoom, roomHandler } from "../../../shared/handlers/room";
import {
  ChatUser,
  SocketUser,
  UserState,
} from "../../../shared/src/types/users";
import { uhandler } from "../../../shared/handlers/usersHandler";
import { newMessage } from "../../../shared/handlers/ConversationHandler";
import { SocketData } from "../../../shared/src/types/types";

export const chatHandlerConnection = (
  chatHandler: Namespace<
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
        state: UserState.online,
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
        state: UserState.online,
        socketId: connInfo.user.socketId,
      });

      socket.data.roomId = roomId;

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
    if (!room && socket.data.roomId) {
      room = roomHandler.getRoom<ChatRoom>(socket.data.roomId) as ChatRoom;
    }
    if (!room?.users) return;

    room.users.updateUser(getUserFromSocket(socket)?.id as string, {
      state,
    });

    const userFromSocket = room.users.getUser(
      getUserFromSocket(socket)?.id as string
    );
    if (userFromSocket) {
      socket.broadcast
        .to(getRoomId(socket))
        .emit("state_change", userFromSocket);
    }
  });
  socket.on("send_message", async (message, callback) => {
    const roomId = socket.data.roomId ?? socket.handshake.auth["roomId"];
    if (socket.data.roomId) {
      room = roomHandler.getRoom<ChatRoom>(socket.data.roomId) as ChatRoom;
    }
    if (!room && roomId) {
      const tempRoom = getRoom(roomId);
      if (!tempRoom) {
        room = roomHandler.createRoom<ChatRoom>(roomId, new ChatRoom(roomId));
      }
    }
    await room.getConversation();
    const nmessage = newMessage(message.userId, message.message);

    const conversationUsers = room.messages.users;
    const users = room.users.getUsers();
    conversationUsers.forEach((user) => {
      const muser = uhandler.getUser(user.id);
      const inChannel = room.users.users.has(user.id);
      if (!inChannel && muser) {
        userHandler.to(muser.socketId).emit("notification_message", {
          user: uhandler.getUser(message.userId)?.user as SocketUser,
        });
      }
    });
    users.forEach((user) => {
      chatHandler.to(user.socketId).emit("receive_message", nmessage);
      // console.log(user.socketId);
    });
    await room.messages.addMessage(nmessage);
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
};
