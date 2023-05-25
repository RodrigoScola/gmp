import { Namespace, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { SocketData } from "../server";
import { UserClientEvents, UserServerEvents } from "../../../shared/types/socketEvents";
export declare const userHandlerConnection: (userHandler: Namespace<UserServerEvents, UserClientEvents, DefaultEventsMap, SocketData>, socket: Socket<UserClientEvents, UserServerEvents, DefaultEventsMap, SocketData>) => void;
