/// <reference types="react" />
import { ChildrenType } from "@/types";
import { Socket } from "socket.io-client";
import { ChatClientEvents, ChatServerEvents } from "../../shared/src/types/socketEvents";
import { IFriend, IUser } from "../../shared/src/types/users";
interface UserContext {
    user: IUser | null;
    getFriends: () => Promise<IFriend[] | undefined>;
    login: (email: string, password: string) => Promise<any>;
    logout: () => Promise<void>;
    updateUser: (user: IUser) => void;
    socket: Socket<ChatClientEvents, ChatServerEvents>;
    friends: IFriend[];
    isLoggedIn: boolean | null;
}
export declare const UserContext: import("react").Context<UserContext | null>;
export declare const UserProvider: ({ children }: {
    children: ChildrenType;
}) => JSX.Element;
export declare const useUser: () => UserContext;
export {};
//# sourceMappingURL=useUser.d.ts.map