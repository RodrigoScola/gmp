import { ComponentProps } from "react";
import { IFriend } from "../../../shared/src/types/users";
export interface FriendsListProps {
    friends?: IFriend[];
}
export interface FriendCardProps {
    friend: IFriend;
    isOpen?: boolean;
}
export declare const FriendCardOpen: ({ friend, isOpen, ...props }: ComponentProps<"div"> & FriendCardProps) => JSX.Element;
export declare const FriendCard: (props: ComponentProps<"div"> & FriendCardProps) => JSX.Element;
export declare const FriendsList: ({ friends }: FriendsListProps) => JSX.Element;
export declare const InviteFriendComponent: (friendId: string) => JSX.Element;
//# sourceMappingURL=FriendsComponents.d.ts.map