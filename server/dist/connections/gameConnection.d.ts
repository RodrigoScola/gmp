import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { ClientToServerEvents, ServerToClientEvents } from "../../../shared/types/socketEvents";
import { SocketData } from "../server";
import { Socket } from "socket.io";
export type MyIo = Server<ServerToClientEvents, ClientToServerEvents, DefaultEventsMap, SocketData>;
export type MySocket = Socket<ServerToClientEvents, ClientToServerEvents, DefaultEventsMap, SocketData>;
export declare const gameHandlerConnection: (io: MyIo, socket: MySocket) => void;
