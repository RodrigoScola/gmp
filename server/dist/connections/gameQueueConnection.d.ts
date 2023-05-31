import { Namespace, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { GameQueueClientEvents, GameQueueServerEvents } from "../../../shared/src/types/socketEvents";
import { SocketData } from "../../../shared/src/types/types";
export declare const gamequeueHandlerConnection: (gamequeueHandler: Namespace<GameQueueClientEvents, GameQueueServerEvents, DefaultEventsMap, SocketData>, socket: Socket<GameQueueClientEvents, GameQueueServerEvents, DefaultEventsMap, SocketData>) => void;
