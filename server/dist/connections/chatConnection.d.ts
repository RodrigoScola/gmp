import { Namespace, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { ChatClientEvents, ChatServerEvents } from "../../../shared/types/socketEvents";
import { SocketData } from "../server";
export declare const chatHandlerConnection: (chatHandler: Namespace<ChatClientEvents, ChatServerEvents, DefaultEventsMap, SocketData>, socket: Socket<ChatClientEvents, ChatServerEvents, DefaultEventsMap, SocketData>) => void;
