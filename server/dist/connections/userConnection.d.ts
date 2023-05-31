import { Namespace, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { UserClientEvents, UserServerEvents } from "../../../shared/src/types/socketEvents";
import { SocketData } from "../../../shared/src/types/types";
export declare const userHandlerConnection: (userHandler: Namespace<UserServerEvents, UserClientEvents, DefaultEventsMap, SocketData>, socket: Socket<UserServerEvents, UserClientEvents, DefaultEventsMap, SocketData>) => void;
