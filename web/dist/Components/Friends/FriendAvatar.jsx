import { UserState } from "@/../shared/src/types/users";
import { Avatar, AvatarBadge, } from "@chakra-ui/react";
export const FriendAvatar = (props) => {
    return (<Avatar name={props.friend.username} {...props}>
               <AvatarBadge boxSize={`1.25em`} {...props.badgeprops} bg={props.friend.status == UserState.online
            ? "green.500"
            : "gray.500"}></AvatarBadge>
          </Avatar>);
};
