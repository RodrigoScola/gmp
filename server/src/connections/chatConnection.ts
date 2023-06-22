import { Namespace, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { db } from "../../../shared/src/db";
import { newMessage } from "../../../shared/src/handlers/ConversationHandler";
import {
     ChatRoom,
     getRoom,
     roomHandler,
} from "../../../shared/src/handlers/room";
import { uhandler } from "../../../shared/src/handlers/usersHandler";
import {
     ChatClientEvents,
     ChatServerEvents,
} from "../../../shared/src/types/socketEvents";
import { SocketData } from "../../../shared/src/types/types";
import {
     ChatUser,
     SocketUser,
     UserState,
} from "../../../shared/src/types/users";
import { getRoomId, getUserFromSocket, userHandler } from "../server";

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
               roomId:
                    (socket.handshake.auth["roomId"] as string) ??
                    roomId.toString(),
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
               room = roomHandler.getRoom<ChatRoom>(roomId) as ChatRoom;
               room.addUser({
                    id: connInfo.user.id,
                    socketId: socket.id,
                    state: UserState.online,
               });
               console.log(room);
               console.log("0000");
          } catch (e) {
               room = roomHandler.createRoom<ChatRoom>(
                    connInfo.roomId,
                    new ChatRoom(roomId)
               );
               await room.getConversation(roomId);
               roomHandler.addUserToRoom<ChatUser>(roomId, {
                    id: connInfo.user.id,
                    state: UserState.online,
                    socketId: connInfo.user.socketId,
               });
               room.addUser({
                    id: connInfo.user.id,
                    socketId: socket.id,
                    state: UserState.online,
               });
               socket.data.roomId = roomId;
               console.log(room);
          }
          if (room) {
               chatHandler
                    .to(roomId)
                    .emit("user_joined", room.users.getUsers());
          }
          socket.join(roomId);

          const hasRoom = roomHandler.getRoom<ChatRoom>(getRoomId(socket));
          if (hasRoom) {
               room = hasRoom;
          }
     });
     socket.on("find_conversation", async (user1Id, user2Id, callback) => {
          let d = await db
               .rpc("find_conversation", {
                    user1_id: user1Id,
                    user2_id: user2Id,
               })
               .single();
          let nconversationId = d.data?.id;

          if (!nconversationId) {
               const { data: nconv } = await db
                    .from("conversations")
                    .insert({
                         user1: user1Id,
                         user2: user2Id,
                    })
                    .select("*")
                    .single();

               nconversationId = nconv?.id as number;
          }
          socket.data.roomId = nconversationId.toString();

          callback({
               id: nconversationId,
               users: [{ id: user1Id }, { id: user2Id }],
               messages: [],
          });
     });
     socket.on("state_change", (state) => {
          if (!room && socket.data.roomId) {
               room = roomHandler.getRoom<ChatRoom>(
                    socket.data.roomId
               ) as ChatRoom;
          }
          if (!room?.users) return;

          room.users.updateUser(getUserFromSocket(socket)?.id as string, {
               state,
          });

          socket.broadcast.to(getRoomId(socket)).emit("state_change", {
               id: room.id,

               users: room.users.getUsers(),
          });
     });
     socket.on("send_message", async (message, callback) => {
          const roomId =
               socket.data.roomId?.toString() ??
               socket.handshake.auth["roomId"];
          if (roomId) {
               room = roomHandler.getRoom<ChatRoom>(roomId) as ChatRoom;
          }
          if (!room && roomId) {
               const tempRoom = getRoom(roomId);
               if (!tempRoom) {
                    room = roomHandler.createRoom<ChatRoom>(
                         roomId,
                         new ChatRoom(roomId)
                    );
               }
          }

          await room.getConversation(roomId);
          const nmessage = newMessage(message.userId, message.message);

          const conversationUsers = room.messages.users;
          const users = room.users.getUsers();
          conversationUsers.forEach((user) => {
               const muser = uhandler.getUser(user.id);
               const inChannel = room.users.users.has(user.id);
               if (!inChannel && muser && user.id !== message.userId) {
                    userHandler
                         .to(muser.socketId)
                         .emit("notification_message", {
                              user: uhandler.getUser(message.userId)
                                   ?.user as SocketUser,
                         });
                    userHandler
                         .to(muser.user.socketId)
                         .emit("notification_message", {
                              user: uhandler.getUser(message.userId)
                                   ?.user as SocketUser,
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
