"use client";
import { baseUrl } from "@/constants";
import { useSocket } from "@/hooks/useSocket";
import { useNotification } from "@/hooks/useToast";
import { useUser } from "@/hooks/useUser";
import { userSocket } from "@/lib/socket";
import { Text, useColorMode } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useEffectOnce } from "usehooks-ts";
import { AddFiendComponent } from "./Notifications/AddFriend";
import { GameInviteComponent } from "./Notifications/GameInvite";
export const Nav = () => {
    const { user } = useUser();
    // NOTE: this is a hack to get the username to show up in the nav bar
    const [username, setUsername] = useState("");
    useEffect(() => {
        if (user) {
            setUsername(user.username);
        }
    }, [user]);
    const { colorMode, setColorMode } = useColorMode();
    useEffectOnce(() => {
        if (colorMode == "light") {
            setColorMode("dark");
        }
    });
    const { addNotification } = useNotification();
    useSocket(userSocket, {
        user: user,
    }, () => {
        userSocket.auth = {
            user: user,
        };
        userSocket.on("add_friend_response", (data) => {
            addNotification("Game Request", {
                duration: 15000,
                isClosable: true,
                render: (a) => (<AddFiendComponent friend={data} {...a}/>),
            });
        });
        userSocket.on("notification_message", (data) => {
            addNotification(`${data.user.username} sent you a message`);
        });
        userSocket.on("game_invite", (data) => {
            console.log(data);
            addNotification("Game Request", {
                duration: 15000,
                render: () => (<GameInviteComponent gameInvite={data}/>),
            });
        });
        userSocket.on("game_invite_accepted", (data) => {
            console.log("game acepted");
            window.location.href = `/play/${data.roomId}/?gamename=${data.gameName}`;
        });
    });
    return (<div className="  bg-gray-800  ">
               <nav className="flex justify-around m-auto w-[90%] items-center py-2 flex-row">
                    <Link className="text-4xl" href={`${baseUrl}`}>
                         <h3 className="font-ginto font-black">TGZ</h3>
                    </Link>

                    <div>
                         {username ? (<Link href={`/user/${username}`}>
                                   <Text className="font-bold selectable px-2 py-1 rounded-lg capitalize">
                                        {username}
                                   </Text>
                              </Link>) : (<div className="flex flex-row gap-2">
                                   <Link href={`${baseUrl}/login`}>login</Link>
                                   <Link href={`${baseUrl}/register`}>
                                        create account
                                   </Link>
                              </div>)}
                    </div>
               </nav>
          </div>);
};
