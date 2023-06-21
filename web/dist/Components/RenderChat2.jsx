"use client";
import { useFriend } from "@/hooks/useFriends";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useUser } from "@/hooks/useUser";
import { chatSocket, socket, usersSocket } from "@/lib/socket";
import { Popover, PopoverContent, PopoverTrigger } from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { BsFillSendPlusFill } from "react-icons/bs";
import { useUpdateEffect } from "usehooks-ts";
import { UserState, } from "../../shared/src/types/users";
import { FriendCardOpen } from "./Friends/FriendsComponents";
import { FriendsTab } from "./tabs/FriendsTab";
var timer;
export const RenderChatMesages = (props) => {
    useProtectedRoute();
    const { user, friends: userFriends, getFriends } = useUser();
    const friend = useFriend();
    useUpdateEffect(() => {
        if (user && userFriends.length < 1) {
            getFriends();
        }
    }, [user?.id]);
    useEffect(() => {
        if (user) {
            getFriends();
            const friendId = props.conversation.users.find((i) => i.id != user.id);
            if (friendId) {
                friend.setFriendId(friendId.id);
                usersSocket.emit("get_user", friendId.id, (user) => {
                    if (user) {
                        friend.updateFriend(user);
                        setReceiverState(user?.status ?? UserState.offline);
                    }
                });
                setAllChat(props.conversation);
            }
        }
    }, [user?.id]);
    useEffect(() => {
        if (user?.id) {
            if (!props.conversation.users.find((i) => i.id == user.id)) {
                window.location.href = "/";
                throw new Error("you are not in this conversation");
            }
        }
    }, []);
    const [currentChat, setCurrentChat] = useState("");
    const documentRef = useRef(null);
    const [allChat, setAllChat] = useState(props.conversation);
    const [receiverState, setReceiverState] = useState(UserState.offline);
    useEffect(() => {
        if (!user) {
            window.location.href = "/";
        }
        chatSocket.auth = {
            user: user,
            roomId: props.conversation.id.toString(),
        };
        chatSocket.connect();
        chatSocket.emit("join_room", chatSocket.auth.roomId.toString());
        chatSocket.on("user_joined", (data) => {
            console.log(data);
        });
        chatSocket.on("state_change", (data) => {
            const receiverState = data.users.find((u) => user?.id !== u.id);
            if (receiverState) {
                setReceiverState(receiverState.state);
            }
        });
        chatSocket.on("receive_message", (data, callback) => {
            if (callback) {
                callback(null, {
                    received: true,
                });
            }
            setAllChat((prev) => {
                return {
                    ...prev,
                    messages: [
                        ...prev.messages,
                        {
                            created: new Date().toISOString(),
                            userId: data.userId,
                            id: data.id,
                            message: data.message,
                        },
                    ],
                };
            });
        });
        return () => {
            if (chatSocket) {
                chatSocket.disconnect();
            }
        };
    }, [socket]);
    const isFriend = useMemo(() => {
        return !!props.isFriend;
    }, [props.isFriend]);
    const inputRef = useRef(null);
    const handleNewMessage = (e) => {
        e.preventDefault();
        if (currentChat.length < 1 || !user)
            return;
        chatSocket.emit("send_message", {
            message: currentChat,
            userId: user.id,
        });
        setCurrentChat("");
        chatSocket.emit("state_change", UserState.online);
    };
    const handleChange = (e) => {
        setCurrentChat(e);
        chatSocket.emit("state_change", UserState.typing);
    };
    useEffect(() => {
        let es = currentChat;
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            if (es == currentChat) {
                chatSocket.emit("state_change", UserState.online);
            }
        }, 1000);
    }, [currentChat]);
    const handleAddFriend = () => {
        if (!friend.id)
            return;
        friend.sendFriendRequest(friend.id);
    };
    // NOTE: I LOVE REACT JESUS
    const [friendUsername, setFriendUsername] = useState("");
    const [userUsername, setUserUsername] = useState("");
    useEffect(() => {
        if (user?.username) {
            setUserUsername(user.username);
        }
    }, [user?.username]);
    useEffect(() => {
        if (friend.friend) {
            setFriendUsername(friend.friend?.username);
        }
    }, [friend.friend]);
    return (<div className="flex flex-row gap-2">
               <div className="w-full m-auto  ">
                    <div className="sticky top-2 mt-2 py-1 px-4  bg-gray-500 rounded-md  flex justify-between items-center bg-red-300">
                         <div className="flex gap-2">
                              {friend.friend && (<Popover>
                                        <PopoverTrigger>
                                             <p className="capitalize">
                                                  {friendUsername}
                                             </p>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                             <FriendCardOpen friend={friend.friend}/>
                                        </PopoverContent>
                                   </Popover>)}
                              {!isFriend && (<button onClick={handleAddFriend}>
                                        add friend
                                   </button>)}
                              {receiverState.toString() !==
            "[Object Object]" && (<div className="capitalize">
                                        {receiverState.toString()}
                                   </div>)}
                         </div>
                         <Popover>
                              <PopoverTrigger>
                                   <div className="button  bg-green">
                                        Invite to Game
                                   </div>
                              </PopoverTrigger>
                              <PopoverContent className="flex gap-2">
                                   <div onClick={() => {
            friend.sendInvite("connect Four");
        }}>
                                        connect4
                                   </div>
                                   <div onClick={() => {
            friend.sendInvite("Tic Tac Toe");
        }}>
                                        tic tac toe
                                   </div>
                                   <div onClick={() => {
            friend.sendInvite("Rock Paper Scissors");
        }}>
                                        rock paper scissors
                                   </div>
                              </PopoverContent>
                         </Popover>
                    </div>
                    <div className="space-y-2 px-6 text-white">
                         {allChat.messages.map((message, i) => {
            let canHideUsername = true;
            if (i > 0) {
                if (allChat.messages[i - 1].userId ===
                    message.userId) {
                    canHideUsername = false;
                }
            }
            if (message.userId === user?.id) {
                return (<div key={i}>
                                             <MessageCard message={message} username={canHideUsername
                        ? userUsername
                        : null}/>
                                        </div>);
            }
            return (<div key={i}>
                                        <MessageCard message={message} username={canHideUsername
                    ? friend.friend?.username
                    : null}/>
                                   </div>);
        })}
                    </div>
                    <div className="px-6 pb-6">
                         <form ref={documentRef} onSubmit={handleNewMessage}>
                              <div className=" rounded-lg search-input flex flex-row pl-4 items-center align-middle">
                                   <input className="w-full input bg-gray-800  " value={currentChat} onChange={(e) => {
            handleChange(e.target.value);
        }} ref={inputRef} placeholder={`Message @${friendUsername}`} type="text"/>
                                   <button type="submit" className=" bg-blue rounded-lg p-2">
                                        <BsFillSendPlusFill />
                                   </button>
                              </div>
                         </form>
                    </div>
               </div>
               <div>
                    <div className="">
                         <FriendsTab friends={userFriends}/>
                    </div>
               </div>
          </div>);
};
const MessageCard = ({ message, username, }) => {
    return (<div className="flex hover:bg-gray-500/80 transition-all ease-out duration-75 rounded-md px-2 justify-start">
               <div>
                    {username && <p className="pt-2">{username}</p>}
                    <div className="pl-6  bg-blue-700 flex items-center p-1 rounded-full right-0 w-fit space-x-2">
                         <div className="flex text-sm text-gray-400/50">
                              <p>{new Date(message.created).getHours()} : </p>
                              <p>{new Date(message.created).getMinutes()}</p>
                         </div>
                         <p>{message.message}</p>
                    </div>
               </div>
          </div>);
};
