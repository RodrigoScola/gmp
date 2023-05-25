/// <reference types="react" />
import { ChildrenType } from "@/types";
import { Socket } from "socket.io-client";
import { IUser, IFriend } from "../../shared/src/types/users";
import { ChatClientEvents, ChatServerEvents } from "../../shared/src/types/socketEvents";
interface UserContext {
    user: IUser;
    setCurrentUser: (user: IUser) => void;
    getFriends: () => Promise<IFriend[] | undefined>;
    login: (email: string, password: string) => Promise<any>;
    logout: () => void;
    socket: Socket<ChatClientEvents, ChatServerEvents>;
    friends: IFriend[];
}
export declare const UserContext: import("react").Context<UserContext | null>;
export declare const UserProvider: ({ children }: {
    children: ChildrenType;
}) => JSX.Element;
export declare const useUser: () => UserContext;
export {};
//# sourceMappingURL=useUser.d.ts.map