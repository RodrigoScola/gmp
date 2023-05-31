import { Namespace, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { ChatClientEvents, ChatServerEvents } from "../../../shared/src/types/socketEvents";
import { SocketData } from "../../../shared/src/types/types";
export declare const chatHandlerConnection: (chatHandler: Namespace<ChatClientEvents, ChatServerEvents, DefaultEventsMap, SocketData>, socket: Socket<ChatClientEvents, ChatServerEvents, DefaultEventsMap, SocketData>) => void;
