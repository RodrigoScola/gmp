import { IFriend, UserState } from "@/../shared/src/types/users";
import {
     Avatar,
     AvatarBadge,
     AvatarBadgeProps,
     AvatarProps,
} from "@chakra-ui/react";

export const FriendAvatar = (
     props: AvatarProps & { friend: IFriend; badgeprops?: AvatarBadgeProps }
) => {
     return (
          <Avatar name={props.friend.username} {...props}>
               <AvatarBadge
                    boxSize={`1.25em`}
                    {...props.badgeprops}
                    bg={
                         props.friend.status == UserState.online
                              ? "green.500"
                              : "gray.500"
                    }
               ></AvatarBadge>
          </Avatar>
     );
};
