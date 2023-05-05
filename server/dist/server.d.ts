import { Server } from "socket.io";
import { User } from "../../web/types";
import { ServerToClientEvents, ClientToServerEvents } from "../../web/types";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
export declare const io: Server<ServerToClientEvents, ClientToServerEvents, DefaultEventsMap, any>;
export interface SocketUser extends User {
    socketId: string;
}
