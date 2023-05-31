import { Namespace, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { UsersClientEvents, UsersServerEvents } from "../../../shared/src/types/socketEvents";
import { SocketData } from "../../../shared/src/types/types";
export declare const usersHandlerConnection: (_: Namespace<UsersServerEvents, UsersClientEvents, DefaultEventsMap, SocketData>, socket: Socket<UsersServerEvents, UsersClientEvents, DefaultEventsMap, SocketData>) => void;
