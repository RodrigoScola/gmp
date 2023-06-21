import { MatchHandler } from "./gameHandlers";
import { UsersHandlers } from "./usersHandler";
import { ConversationHandler } from "./ConversationHandler";
import { MatchQueue } from "./matchQueue";
import { ChatUser, QueueRoomuser, SocketUser } from "../types/users";
import { IGame } from "../types/game";
export declare class RoomHandler {
    rooms: Map<string, IRoom>;
    constructor();
    roomExists(roomId: string): boolean;
    createRoom<T extends IRoom>(roomId: string, room: IRoom): T;
    getRoom<T extends IRoom>(roomId: string): T | undefined;
    deleteRoom(roomId: string): void;
    addUserToRoom<T>(roomId: string, user: T): void;
}
export declare const roomHandler: RoomHandler;
export declare const getRoom: (roomId: string) => IRoom | undefined;
export interface IRoom {
    id: string;
    users: UsersHandlers<any>;
    addUser(user: any): void;
    delete(): void;
}
export declare class Room implements Room {
    id: string;
    users: UsersHandlers;
    constructor(id: string, users?: SocketUser[]);
}
export declare class ChatRoom implements IRoom {
    id: string;
    users: UsersHandlers<ChatUser>;
    messages: ConversationHandler;
    addUser(user: ChatUser): void;
    constructor(id: string, users?: SocketUser[]);
    getConversation(conversationId?: string): Promise<import("../types/users").ChatConversationType | undefined>;
    delete(): void;
}
export declare class QueueRoom implements IRoom {
    id: string;
    gameQueue: MatchQueue;
    users: UsersHandlers<QueueRoomuser>;
    constructor(id: string);
    addUser(user: QueueRoomuser): QueueRoomuser;
    delete(): void;
}
export declare class GameRoom implements IRoom {
    id: string;
    users: UsersHandlers;
    match: MatchHandler;
    constructor(id: string, game: IGame, users?: SocketUser[]);
    addUser(user: SocketUser): void;
    delete(): void;
}
