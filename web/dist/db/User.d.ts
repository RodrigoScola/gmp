import { IFriend, IUser } from "../../shared/src/types/users";
type UserClassConstructor = {
    id: string;
};
export declare const getUserByUsername: (username: string) => Promise<IUser>;
export declare class User {
    private _info?;
    id: string;
    constructor({ id }: UserClassConstructor);
    getUser(): Promise<IUser | undefined>;
}
export interface newUserOptions {
    extended?: boolean;
}
export declare const newUser: (data?: Partial<IUser> | undefined | null, baseOptions?: Partial<newUserOptions>) => IUser;
type newFriendOptions = {
    extended?: boolean;
};
export declare const newFriend: (data?: Partial<IFriend>, options?: Partial<newFriendOptions>) => IFriend;
export {};
//# sourceMappingURL=User.d.ts.map