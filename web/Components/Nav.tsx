"use client";

import { useSupabase } from "@/app/supabase-provider";
import { baseUrl } from "@/constants";
import { useNotifications } from "@/hooks/useToast";
import { useUser } from "@/hooks/useUser";
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
import { User } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useState } from "react";
import { useEffectOnce } from "usehooks-ts";
import { ChangeUsernameComponent } from "./ChangeUsername";

export const Nav = () => {
     const { user, isLoggedIn, updateUser } = useUser();
     useNotifications();
     // NOTE: this is a hack to get the username to show up in the nav bar
     const { colorMode, setColorMode } = useColorMode();
     useEffectOnce(() => {
          if (colorMode == "light") {
               setColorMode("dark");
          }
     });
     const [canSetUsername, setCanSetUsername] = useState<boolean>(false);
     const [currentUser, setCurrentUser] = useState<User | null>(null);
     const supabase = useSupabase();
     const { onClose } = useDisclosure();
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
