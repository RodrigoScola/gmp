import { Server, Socket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "./socketEvents";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { IUser } from "./users";
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type OmitBy<T, K extends keyof T> = Omit<T, K>;
export type Badges = {
    totalBadges: number;
    badges: Badge[];
};
export type Badge = {
    id: number;
    name: string;
    description: string;
    created: string;
};
export type Direction = "up" | "down" | "left" | "right";
export type Coords = {
    x: number;
    y: number;
};
export type MyIo = Server<ServerToClientEvents, ClientToServerEvents, DefaultEventsMap, SocketData>;
export type MySocket = Socket<ServerToClientEvents, ClientToServerEvents, DefaultEventsMap, SocketData>;
export type SocketData = {
    user: IUser;
    roomId: string;
};
