"use client";

import { useUser } from "@/hooks/useUser";
import Link from "next/link";
import { useNotifications } from "@/hooks/useToast";
import {
     Heading,
     Modal,
     ModalBody,
     ModalCloseButton,
     ModalContent,
     ModalHeader,
     ModalOverlay,
     useColorMode,
     useDisclosure,
} from "@chakra-ui/react";
import { useEffectOnce } from "usehooks-ts";
import { useEffect, useState } from "react";
import { baseUrl } from "@/constants";
import { User } from "@supabase/auth-helpers-nextjs";
import { ChangeUsernameComponent } from "./ChangeUsername";
import { useSupabase } from "@/app/supabase-provider";

export const Nav = () => {
     const { user, isLoggedIn, updateUser } = useUser();
     useNotifications();
     // NOTE: this is a hack to get the username to show up in the nav bar
     console.log(isLoggedIn);
     const { colorMode, setColorMode } = useColorMode();
     useEffectOnce(() => {
          if (colorMode == "light") {
               setColorMode("dark");
          }
     });
     const [canSetUsername, setCanSetUsername] = useState<boolean>(false);
     const [currentUser, setCurrentUser] = useState<User | null>(null);
     const supabase = useSupabase();
     const { isOpen, onClose, onOpen } = useDisclosure();
     const handleClose = () => {
          onClose();
          setCanSetUsername(false);
     };
     useEffectOnce(() => {
          supabase.supabase.auth.getUser().then(({ data: { user } }) => {
               if (user) {
                    setCurrentUser(user);
                    console.log(user);
                    supabase.supabase
                         .from("profiles")
                         .select("*")
                         .eq("id", user.id)
                         .single()
                         .then(({ error, data }) => {
                              if (error || data.username == "") {
                                   setCanSetUsername(true);
                              } else {
                                   updateUser(data);
                              }
                         });
               }
          });
     });
     return (
          <div className="  bg-blue-900 w-screen ">
               <Modal onClose={() => handleClose()} isOpen={canSetUsername}>
                    <ModalOverlay />
                    <ModalContent>
                         <ModalHeader>Set Username</ModalHeader>
                         <ModalCloseButton />
                         <ModalBody>
                              <ChangeUsernameComponent
                                   onClose={handleClose}
                                   currentUser={currentUser}
                              />
                         </ModalBody>
                    </ModalContent>
               </Modal>

               <nav className="flex justify-around m-auto w-[90%] items-center py-2 flex-row">
                    <Link className="text-4xl" href={`${baseUrl}`}>
                         <Heading>TGZ</Heading>
                    </Link>

                    <div>
                         {isLoggedIn ? (
                              <Link href={`/user/${user?.username}`}>
                                   {/* <Text className="font-bold capitalize"> */}
                                   {user?.username}
                                   {/* </Text> */}
                              </Link>
                         ) : (
                              <div className="flex flex-row gap-2">
                                   <Link href={`${baseUrl}/login`}>login</Link>
                              </div>
                         )}
                    </div>
               </nav>
          </div>
     );
};
