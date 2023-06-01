"use client";

import { useSupabase } from "@/app/supabase-provider";
import { useUser } from "@/hooks/useUser";
import {
     Button,
     FormControl,
     FormErrorMessage,
     FormLabel,
     Input,
} from "@chakra-ui/react";
import { FormEvent, useState } from "react";
import { User } from "@supabase/supabase-js";
import { useNotification } from "@/hooks/useToast";

export const ChangeUsernameComponent = ({
     currentUser,
     onClose,
}: {
     currentUser: User | null;
     onClose: () => void;
}) => {
     const [newUsername, setUsername] = useState<string>("");
     const mainUser = useUser();
     // const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
     //      null
     // );
     const { supabase } = useSupabase();
     const { addNotification } = useNotification();
     const [message, setMessage] = useState<string>("");
     const checkUsernameAvailable = async (username: string) => {
          const { data } = await supabase
               .from("profiles")
               .select("*")
               .eq("username", username)
               .single();
          if (data) {
               return false;
          }
          return true;
     };
     const handleSubmitNewUsername = async (e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          const available = await checkUsernameAvailable(newUsername);
          if (!available) {
               addNotification("username already taken", {
                    status: "error",
                    position: "top",
               });
               return;
          }
          if (available && currentUser) {
               await supabase
                    .from("profiles")
                    .insert({
                         email: currentUser.email ?? "",
                         id: currentUser?.id,
                         username: newUsername,
                    })
                    .select("*")
                    .single()
                    .then((data) => {
                         if (data.error) {
                              supabase
                                   .from("profiles")
                                   .update({
                                        username: newUsername,
                                   })
                                   .eq("id", currentUser?.id)
                                   .select("*")
                                   .single()
                                   .then(({ data }) => {
                                        if (data) {
                                             mainUser.updateUser(data);
                                        }
                                   });
                         }
                    });
               onClose();
          }
     };
     return (
          <form onSubmit={(e) => handleSubmitNewUsername(e)}>
               <FormControl>
                    <FormLabel>Username</FormLabel>
                    <Input
                         value={newUsername}
                         onChange={(e) => setUsername(e.target.value)}
                    />
               </FormControl>
               <FormErrorMessage>
                    {message ? "username already taken" : ""}
               </FormErrorMessage>
               <div>
                    <Button type="submit">Finish</Button>
               </div>
          </form>
     );
};
