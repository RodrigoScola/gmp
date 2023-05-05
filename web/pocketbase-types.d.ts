/**
 * This file was @generated using pocketbase-typegen
 */
export declare enum Collections {
    Users = "users"
}
export type IsoDateString = string;
export type RecordIdString = string;
export type HTMLString = string;
export type BaseSystemFields<T> = {
    id: RecordIdString;
    created: IsoDateString;
    updated: IsoDateString;
    collectionId: string;
    collectionName: Collections;
    expand?: T;
};
export type AuthSystemFields<T = never> = {
    email: string;
    emailVisibility: boolean;
    username: string;
    verified: boolean;
} & BaseSystemFields<T>;
export type UsersRecord = {
    name?: string;
    avatar?: string;
};
export type UsersResponse<T = null> = UsersRecord & AuthSystemFields<T>;
export type CollectionRecords = {
    users: UsersRecord;
};
export type CollectionResponses = {
    users: UsersResponse;
};
