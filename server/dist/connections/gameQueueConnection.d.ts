import { Namespace, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { SocketData } from "../server";
import { GameQueueClientEvents, GameQueueServerEvents } from "../../../shared/types/socketEvents";
export declare const gamequeueHandlerConnection: (gamequeueHandler: Namespace<GameQueueClientEvents, GameQueueServerEvents, DefaultEventsMap, SocketData>, socket: Socket<GameQueueClientEvents, GameQueueServerEvents, DefaultEventsMap, SocketData>) => void;
