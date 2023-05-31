import { io, Socket as SC } from "socket.io-client";
import {
     ServerToClientEvents,
     ClientToServerEvents,
     ChatClientEvents,
     ChatServerEvents,
     GameQueueClientEvents,
     GameQueueServerEvents,
     UserServerEvents,
     UserClientEvents,
     UsersServerEvents,
     UsersClientEvents,
} from "../../shared/src/types/socketEvents";
import { IUser } from "../../shared/src/types/users";
import { GameNames } from "../../shared/src/types/game";
import { socketUrl } from "@/constants";

export const socket: SC<ClientToServerEvents, ServerToClientEvents> = io(
     socketUrl,
     {
          transports: ["websocket"],
          autoConnect: false,
     }
);

export const chatSocket: SC<ChatServerEvents, ChatClientEvents> = io(
     `${socketUrl}/chat`,
     {
          transports: ["websocket"],
          autoConnect: false,
     }
);

export const usersSocket: SC<UsersServerEvents, UsersClientEvents> = io(
     `${socketUrl}/users`,
     {
          transports: ["websocket"],
          autoConnect: false,
     }
);
export const userSocket: SC<UserClientEvents, UserServerEvents> = io(
     `${socketUrl}/user`,
     {
          transports: ["websocket"],
          autoConnect: false,
     }
);

export const queueSocket: SC<GameQueueServerEvents, GameQueueClientEvents> = io(
     `${socketUrl}/gamequeue`,
     {
          transports: ["websocket"],
          autoConnect: false,
     }
);
export type SocketAuth = {
     user: IUser;
     roomId: string;
     gameName: GameNames;
};
export const newSocketAuth = (params: SocketAuth): SocketAuth => {
     return {
          user: params.user,
          roomId: params.roomId,
          gameName: params.gameName,
     };
};
