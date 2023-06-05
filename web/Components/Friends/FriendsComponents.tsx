"use client";
import { useFriend } from "@/hooks/useFriends";
import { useUser } from "@/hooks/useUser";
import Profile from "@/images/profile.webp";
import { chatSocket } from "@/lib/socket";
import {
     Popover,
     PopoverContent,
     PopoverTrigger,
     useDisclosure,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { ComponentProps, FormEvent, useEffect, useState } from "react";
import { ChatConversationType, IFriend } from "../../../shared/src/types/users";
export interface FriendsListProps {
     friends?: IFriend[];
}
export interface FriendCardProps {
     friend: IFriend;
     isOpen?: boolean;
}
const FriendCardOpen = ({
     friend,
     isOpen,
     ...props
}: ComponentProps<"div"> & FriendCardProps) => {
     // const drawer = useDrawer();
     const handleFriend = useFriend(friend.id);
     const { user } = useUser();
     const [chatInformation, setChatInformation] =
          useState<ChatConversationType | null>(null);
     const [message, setMessage] = useState<string>("");

     useEffect(() => {
          if (!isOpen || !user) return;
          if (!chatSocket.connected) {
               chatSocket.auth = {
                    user: user,
               };
               chatSocket.connect();
          }
          chatSocket.emit("find_conversation", user?.id, friend.id, (data) => {
               console.log(data);
               setChatInformation(data);
               console.log(data.id.toString());
               chatSocket.emit("join_room", data.id.toString());
          });

          return () => {
               if (chatSocket.connected) chatSocket.disconnect();
          };
     }, [isOpen]);

     const handleNewMessage = (e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          if (!user) return;
          chatSocket.emit(
               "send_message",
               {
                    message,
                    userId: user.id,
               },
               (data: any) => {
                    if (data.received == true && chatInformation) {
                         window.location.pathname = `user/${chatInformation.id}/chat`;
                    }
               }
          );
     };

     return (
          <div {...props} className=" text-white bg-blue-200 z-10 ">
               <div>
                    <Image
                         src={Profile.src}
                         alt={`profile image for ${friend.username}`}
                         width={75}
                         height={75}
                    />
                    <Link href={`/user/${friend.username}`}>
                         {friend.username}
                    </Link>
                    <div className="flex">
                         {/* {friend.expand?.badges?.badges?.map((badge) => {
            return <div key={friend?.id + "_" + badge?.id}>{badge?.name}</div>;
          })} */}
                    </div>
               </div>
               <div>Friends Since 1 - Feb - 2023</div>
               <Popover offset={[1, 2]}>
                    <PopoverTrigger>
                         <div>Invite to game</div>
                    </PopoverTrigger>
                    <PopoverContent className=" gap-2 z-50">
                         <div
                              onClick={() => {
                                   handleFriend.sendInvite("connect Four");
                              }}
                         >
                              connect4
                         </div>
                         <div
                              onClick={() => {
                                   handleFriend.sendInvite("Tic Tac Toe");
                              }}
                         >
                              tic tac toe
                         </div>
                         <div
                              onClick={() => {
                                   handleFriend.sendInvite(
                                        "Rock Paper Scissors"
                                   );
                              }}
                         >
                              rock paper scissors
                         </div>
                    </PopoverContent>
               </Popover>
               <div>
                    <h3>Stats</h3>
                    <div className="grid grid-cols-2">
                         {/* {Object.values(friend?.expand?.games ?? []).map((game) => {
            return (
              <div key={game.id}>
                <p>{game.name}</p>
                <p>Wins {game.won}</p>
                <p>Losses {game.lost}</p>
              </div>
            );
          })} */}
                    </div>
               </div>
               <div>
                    <p>Note: </p>
                    <p>{friend.note}</p>
               </div>
               <div className="m-auto">
                    <form onSubmit={handleNewMessage}>
                         <input
                              onChange={(e) => setMessage(e.target.value)}
                              value={message}
                              placeholder={`message @${friend.username}`}
                         />
                    </form>
               </div>
          </div>
     );
};

export const FriendCard = (props: ComponentProps<"div"> & FriendCardProps) => {
     const { isOpen, onClose, onOpen } = useDisclosure({
          defaultIsOpen: false,
     });
     return (
          <>
               <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
                    <PopoverTrigger>
                         <div>{props.friend.username}</div>
                    </PopoverTrigger>
                    <PopoverContent className="text-black p-0 mr-4 left-20 z-10">
                         <FriendCardOpen
                              isOpen={isOpen}
                              friend={props.friend}
                         />
                    </PopoverContent>
               </Popover>
          </>
     );
};

export const FriendsList = ({ friends }: FriendsListProps) => {
     return (
          <div className="space-y-3 ">
               {friends?.map((friend) => {
                    return <FriendCard key={friend.id} friend={friend} />;
               })}
          </div>
     );
};
