import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { ClientToServerEvents, ServerToClientEvents } from "../../../shared/src/types/socketEvents";
import { Socket } from "socket.io";
import { SocketData } from "../../../shared/src/types/types";
export type MyIo = Server<ServerToClientEvents, ClientToServerEvents, DefaultEventsMap, SocketData>;
export type MySocket = Socket<ServerToClientEvents, ClientToServerEvents, DefaultEventsMap, SocketData>;
export declare const gameHandlerConnection: (io: MyIo, socket: MySocket) => void;
