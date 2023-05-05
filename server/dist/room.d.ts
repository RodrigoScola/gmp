import { RockPaperScissorsGame } from "./game/rockpaperScissors";
import { SocketUser } from "./server";
export declare class RoomHandler {
    rooms: Map<string, Room>;
    constructor();
    roomExists(roomId: string): boolean;
    createRoom(roomId: string): void;
    getRoom(roomId: string): Room | undefined;
    addUserToRoom(roomId: string, user: SocketUser): void;
}
export declare class Room {
    id: string;
    users: SocketUser[];
    game: RockPaperScissorsGame;
    constructor(id: string, users: []);
}
