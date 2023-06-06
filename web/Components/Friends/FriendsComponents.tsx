"use client";
import { useFriend } from "@/hooks/useFriends";
import { useUser } from "@/hooks/useUser";
import { chatSocket } from "@/lib/socket";
import {
     Popover,
     PopoverContent,
     PopoverTrigger,
     useDisclosure,
} from "@chakra-ui/react";
import Link from "next/link";
import { ComponentProps, FormEvent, useEffect, useState } from "react";
import { ChatConversationType, IFriend } from "../../../shared/src/types/users";
import { FriendAvatar } from "./FriendAvatar";
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
               setChatInformation(data);
               chatSocket.emit("join_room", data.id.toString());
          });

          return () => {
               if (chatSocket.connected) chatSocket.disconnect();
          };
     }, [isOpen, friend.id]);
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
          <div className="px-4 py-2 text-white bg-gradient-to-b to-blue-600  from-blue-500  z-10 ">
               <div>
                    <div className="flex flex-row items-center gap-4">
                         <FriendAvatar
                              badgeProps={{
                                   boxSize: "1em",
                              }}
                              friend={friend}
                         />

                         <Link href={`/user/${friend.username}`}>
                              {friend.username}
                         </Link>
                    </div>
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
               {friend.note && (
                    <div>
                         <p>Note: </p>
                         <p>{friend.note}</p>
                    </div>
               )}
               <div className="">
                    <form
                         className="gap-1 inline-flex w-full"
                         onSubmit={handleNewMessage}
                    >
                         <input
                              onChange={(e) => setMessage(e.target.value)}
                              className="rounded-md bg-blue-1000"
                              value={message}
                              placeholder={`message @${friend.username}`}
                         />
                         <button className="bg-blue-600  rounded-md px-1">
                              send Icon
                         </button>
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
               <Popover
                    isLazy
                    placement="left-start"
                    isOpen={isOpen}
                    onOpen={onOpen}
                    onClose={onClose}
               >
                    <PopoverTrigger>
                         <div className="inline-flex gap-2 cursor-pointer">
                              <FriendAvatar size={"xs"} friend={props.friend} />
                              <p className="capitalize">
                                   {props.friend.username}
                              </p>
                         </div>
                    </PopoverTrigger>
                    <PopoverContent
                         dir="left"
                         className="text-black p-0 mr-4 left-20 z-10"
                    >
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

export const InviteFriendComponent = (friendId: string) => {
     const handleFriend = useFriend();

     useEffect(() => {
          handleFriend.setFriendId(friendId);
     }, [friendId]);

     return (
          <div>
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
                         handleFriend.sendInvite("Rock Paper Scissors");
                    }}
               >
                    rock paper scissors
               </div>
          </div>
     );
};
