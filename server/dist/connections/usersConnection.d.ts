import { Namespace, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { SocketData } from "../server";
import { UsersClientEvents, UsersServerEvents } from "../../../shared/types/socketEvents";
export declare const usersHandlerConnection: (_: Namespace<UsersServerEvents, UsersClientEvents, DefaultEventsMap, SocketData>, socket: Socket<UsersServerEvents, UsersClientEvents, DefaultEventsMap, SocketData>) => void;
