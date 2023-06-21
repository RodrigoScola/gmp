import { Socket as SC } from "socket.io-client";
import { GameNames } from "../../shared/src/types/game";
import { ChatClientEvents, ChatServerEvents, ClientToServerEvents, GameQueueClientEvents, GameQueueServerEvents, ServerToClientEvents, UserClientEvents, UsersClientEvents, UserServerEvents, UsersServerEvents } from "../../shared/src/types/socketEvents";
import { IUser } from "../../shared/src/types/users";
export declare const socket: SC<ClientToServerEvents, ServerToClientEvents>;
export declare const chatSocket: SC<ChatServerEvents, ChatClientEvents>;
export declare const usersSocket: SC<UsersServerEvents, UsersClientEvents>;
export declare const userSocket: SC<UserClientEvents, UserServerEvents>;
export declare const queueSocket: SC<GameQueueServerEvents, GameQueueClientEvents>;
export type SocketAuth = {
    user: IUser;
    roomId: string;
    gameName: GameNames;
};
export declare const newSocketAuth: (params: SocketAuth) => SocketAuth;
//# sourceMappingURL=socket.d.ts.map