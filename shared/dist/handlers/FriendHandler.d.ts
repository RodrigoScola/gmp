import { IFriend } from "../types/users";
export type FriendRequestStatus = "pending" | "accepted" | "rejected";
export type FriendRequest = {
    status: FriendRequestStatus;
    id: number;
    users: string[];
};
export declare class FriendHandler {
    userId: string;
    private _friends;
    constructor(userId: string);
    get friends(): IFriend[];
    getFriends(userId?: string): Promise<IFriend[]>;
    getRequest(userId: string, userId2?: string): Promise<FriendRequest | undefined>;
    addFriendRequest(userId: string): Promise<{
        created_at: string;
        friend1: string;
        friend2: string;
        id: number;
        status: string;
    } | null>;
    isFriend(userId: string): Promise<boolean>;
}
