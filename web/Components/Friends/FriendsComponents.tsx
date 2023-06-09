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
          <div
               className={`px-4 bg-gray-800  rounded-lg py-2 text-white   z-10 ${props.className}`}
               {...props}
          >
               <div className="rounded-t-xl py-2 pl-1 rounded-b-md">
                    <div className="flex  flex-row items-center gap-4">
                         <FriendAvatar
                              boxSize={`2em`}
                              badgeProps={{
                                   boxSize: `1em`,
                              }}
                              friend={friend}
                         />

                         <Link
                              className="capitalize text-xl font-bold text-white"
                              href={`/user/${friend.username}`}
                         >
                              {friend.username}
                         </Link>
                    </div>
               </div>
               <div className="bg-gray-900 p-2 mt-2 shadow-md rounded-sm rounded-b-xl rounded-t-md ">
                    <Popover isLazy offset={[1, 2]}>
                         <PopoverTrigger>
                              <div className="py-2 cursor-pointer w-fit px-1">
                                   <p className="font-sans text-sm font-semibold">
                                        Invite to a Game
                                   </p>
                              </div>
                         </PopoverTrigger>
                         <PopoverContent className="capitalize border-none  outline-2  px-1 gap-2 z-50">
                              <div
                                   className="selectable"
                                   onClick={() => {
                                        handleFriend.sendInvite("connect Four");
                                   }}
                              >
                                   Connect Four
                              </div>
                              <div
                                   className="selectable"
                                   onClick={() => {
                                        handleFriend.sendInvite("Tic Tac Toe");
                                   }}
                              >
                                   Tic Tac Toe
                              </div>
                              <div
                                   className="selectable"
                                   onClick={() => {
                                        handleFriend.sendInvite(
                                             "Rock Paper Scissors"
                                        );
                                   }}
                              >
                                   Rock Paper Scissors
                              </div>
                         </PopoverContent>
                    </Popover>
                    {friend.note && (
                         <div>
                              <p>Note: </p>
                              <p>{friend.note}</p>
                         </div>
                    )}
                    <div className="pt-1">
                         <form
                              className="gap-1 inline-flex w-full"
                              onSubmit={handleNewMessage}
                         >
                              <div className="flex flex-col">
                                   <p className="font-whitney font-semibold">
                                        Message
                                   </p>
                                   <input
                                        onChange={(e) =>
                                             setMessage(e.target.value)
                                        }
                                        className="search-input w-full"
                                        value={message}
                                        placeholder={`Message @${friend.username}`}
                                   />
                              </div>
                         </form>
                    </div>
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
                    isOpen={isOpen}
                    placement="left"
                    onOpen={onOpen}
                    onClose={onClose}
               >
                    <PopoverTrigger>
                         <div className=" py-1 px-1 hover:rounded-md transition-all duration-75  inline-flex hover:bg-gray-500 font-whitney  gap-2 cursor-pointer">
                              <FriendAvatar size={"xs"} friend={props.friend} />
                              <p className="capitalize">
                                   {props.friend.username}
                              </p>
                         </div>
                    </PopoverTrigger>
                    <PopoverContent className="text-black noselect p-0 mr-4 left-20 border-none z-10">
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
