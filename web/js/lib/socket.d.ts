import { Socket as SC } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents, ChatClientEvents, ChatServerEvents, GameQueueClientEvents, GameQueueServerEvents, UserServerEvents, UserClientEvents, UsersServerEvents, UsersClientEvents } from "../../shared/src/types/socketEvents";
import { IUser } from "../../shared/src/types/users";
import { GameNames } from "../../shared/src/types/game";
export declare const socket: SC<ClientToServerEvents, ServerToClientEvents>;
export type SocketAuth = {
    user: IUser;
    roomId: string;
    gameName: GameNames;
};
export declare const chatSocket: SC<ChatServerEvents, ChatClientEvents>;
export declare const usersSocket: SC<UsersServerEvents, UsersClientEvents>;
export declare const userSocket: SC<UserServerEvents, UserClientEvents>;
export declare const queueSocket: SC<GameQueueServerEvents, GameQueueClientEvents>;
export declare const newSocketAuth: (params: SocketAuth) => SocketAuth;
//# sourceMappingURL=socket.d.ts.map