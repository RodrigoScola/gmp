import { Player } from "../types/game";
import { SocketUser, UserGameState, UserState } from "../types/users";
import { FriendHandler } from "./FriendHandler";
import { GameInviteHandler } from "./GameInvitehandler";
export type IMainUser = {
    user: SocketUser;
    id: string;
    currentState: UserState;
    game?: {
        state: UserGameState;
        gameId: string | null;
    };
    socketId: string;
};
export declare class MainUser implements IMainUser {
    user: SocketUser;
    id: string;
    currentState: UserState;
    friends: FriendHandler;
    game?: {
        state: UserGameState;
        gameId: string | null;
    };
    socketId: string;
    constructor(user: IMainUser);
}
declare class MainUserHandler {
    users: Map<string, MainUser>;
    invites: GameInviteHandler;
    userNames: Map<string, string>;
    constructor();
    addUser(user: SocketUser): MainUser;
    updateUser(userId: string, info: Partial<IMainUser>): IMainUser | undefined;
    getUsers(): MainUser[];
    getUser(id: string): MainUser | undefined;
    getUserByUsername(username: string): string | undefined;
    deleteUser(id: string): void;
}
export declare const uhandler: MainUserHandler;
export type RoomUser = {
    user: IMainUser;
    socketId: string;
};
export declare class UsersHandlers<T = {
    socketId: string;
}> {
    users: Map<string, T & {
        id: string;
    }>;
    constructor();
    addUser(user: T & {
        id: string;
    }): void;
    updateUser(userId: string, info: Partial<T>): void;
    getUsers(): (T & {
        id: string;
    })[];
    getUser(id: string): (T & {
        id: string;
    }) | undefined;
    deleteUser(id: string): void;
}
export declare class PlayerHandler<T extends Player> {
    players: Record<string, T & {
        id: string;
    }>;
    addPlayer(player: T & {
        id: string;
    }): void;
    getPlayers(): T[];
    getPlayer(playerId: string): T & {
        id: string;
    };
    removePlayer(playerId: string): void;
    hasPlayer(playerId: string): boolean;
}
export {};
