"use client";
import { useSupabase } from "@/app/supabase-provider";
import { useNotification } from "@/hooks/useToast";
import { useUser } from "@/hooks/useUser";
import { Button, FormControl, FormErrorMessage, FormLabel, Input, } from "@chakra-ui/react";
import { useState } from "react";
export const ChangeUsernameComponent = ({ currentUser, onClose, }) => {
    const [newUsername, setUsername] = useState("");
    const mainUser = useUser();
    // const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    //      null
    // );
    const { supabase } = useSupabase();
    const { addNotification } = useNotification();
    const [message, _] = useState("");
    const checkUsernameAvailable = async (username) => {
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
    const handleSubmitNewUsername = async (e) => {
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
    return (<form onSubmit={(e) => handleSubmitNewUsername(e)}>
               <FormControl>
                    <FormLabel>Username</FormLabel>
                    <Input value={newUsername} onChange={(e) => setUsername(e.target.value)}/>
               </FormControl>
               <FormErrorMessage>
                    {message ? "username already taken" : ""}
               </FormErrorMessage>
               <div>
                    <Button type="submit">Finish</Button>
               </div>
          </form>);
};
