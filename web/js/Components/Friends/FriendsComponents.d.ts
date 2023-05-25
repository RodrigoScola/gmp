import { IFriend } from "../../../shared/src/types/users";
import { ComponentProps } from "react";
export interface FriendsListProps {
    friends?: IFriend[];
}
export interface FriendCardProps {
    friend: IFriend;
}
export declare const FriendCard: (props: ComponentProps<"div"> & FriendCardProps) => JSX.Element;
export declare const FriendsList: ({ friends }: FriendsListProps) => JSX.Element;
//# sourceMappingURL=FriendsComponents.d.ts.map