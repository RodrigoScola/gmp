import { Server, Socket, Namespace } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { ServerToClientEvents, ChatClientEvents, ChatServerEvents, ClientToServerEvents, UsersServerEvents, UsersClientEvents } from "../../shared/types/socketEvents";
import { IUser } from "../../shared/types/users";
export declare const io: Server<ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData>;
type InterServerEvents = {};
export type SocketData = {
    user: IUser;
    roomId: string;
};
export type MyIo = Server<ServerToClientEvents, ClientToServerEvents, DefaultEventsMap, SocketData>;
export type MySocket = Socket<ServerToClientEvents, ClientToServerEvents, DefaultEventsMap, SocketData>;
export declare const chatHandler: Namespace<ChatClientEvents, ChatServerEvents, DefaultEventsMap, SocketData>;
export declare const usersHandler: Namespace<UsersServerEvents, UsersClientEvents, DefaultEventsMap, SocketData>;
export declare const userHandler: Namespace<ChatClientEvents, ChatServerEvents, DefaultEventsMap, SocketData>;
export declare const getUserFromSocket: (socket: MySocket) => IUser | undefined;
export declare const gameId = "a0s9df0a9sdjf";
export declare const getRoomId: (socket: MySocket) => any;
export {};
