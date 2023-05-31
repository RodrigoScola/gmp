"use client";

import { useUser } from "@/hooks/useUser";
import Link from "next/link";
import { useNotifications } from "@/hooks/useToast";
import { Heading, useColorMode } from "@chakra-ui/react";
import { useEffectOnce } from "usehooks-ts";
import { useEffect, useState } from "react";
import { baseUrl } from "@/constants";

export const Nav = () => {
     const { user } = useUser();
     useNotifications();
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
