"use client";

import { GameInvite, IUser } from "@/../shared/src/types/users";
import { baseUrl } from "@/constants";
import { useSocket } from "@/hooks/useSocket";
import { useNotification } from "@/hooks/useToast";
import { useUser } from "@/hooks/useUser";
import { userSocket } from "@/lib/socket";
import { Heading, useColorMode } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useEffectOnce } from "usehooks-ts";
import { AddFiendComponent } from "./Notifications/AddFriend";
import { GameInviteComponent } from "./Notifications/GameInvite";

export const Nav = () => {
     const { user } = useUser();
     // NOTE: this is a hack to get the username to show up in the nav bar
     const [username, setUsername] = useState<string>("");
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
     useSocket<{ user: IUser | null }>(
          userSocket,
          () => {
               userSocket.auth = {
                    user: user,
               };
               console.log("a");
               userSocket.on("add_friend_response", (data) => {
                    addNotification("Game Request", {
                         duration: 15000,
                         render: () => <AddFiendComponent friend={data} />,
                    });
               });
               userSocket.on("notification_message", (data) => {
                    addNotification(`${data.user.username} sent you a message`);
               });
               userSocket.on("game_invite", (data: GameInvite) => {
                    console.log(data);
                    addNotification("Game Request", {
                         duration: 15000,
                         render: () => (
                              <GameInviteComponent gameInvite={data} />
                         ),
                    });
               });
               userSocket.on("game_invite_accepted", (data) => {
                    console.log("game acepted");
                    window.location.href = `/play/${data.roomId}`;
               });
          },
          {
               user: user,
          }
     );
     return (
          <div className="  bg-blue-900 w-screen ">
               <nav className="flex justify-around m-auto w-[90%] items-center py-2 flex-row">
                    <Link className="text-4xl" href={`${baseUrl}`}>
                         <Heading>TGZ</Heading>
                    </Link>

                    <div>
                         {username ? (
                              <Link href={`/user/${username}`}>
                                   {/* <Text className="font-bold capitalize"> */}
                                   {username}
                                   {/* </Text> */}
                              </Link>
                         ) : (
                              <div className="flex flex-row gap-2">
                                   <Link href={`${baseUrl}/login`}>login</Link>
                                   <Link href={`${baseUrl}/register`}>
                                        create account
                                   </Link>
                              </div>
                         )}
                    </div>
               </nav>
          </div>
     );
};
