"use client"

import { useSupabase } from "@/app/supabase-provider"
import { useNotification } from "@/hooks/useToast"
import { useUser } from "@/hooks/useUser"
import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react"
import { FormEvent, useState } from "react"
import { IUser } from "../../shared/src/types/users"

export const ChangeUsernameComponent = ({
     currentUser,
     onClose,
}: {
     currentUser: IUser | null
     onClose: () => void
}) => {
     const [newUsername, setUsername] = useState<string>("")
     const mainUser = useUser()
     // const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
     //      null
     // );
     const { supabase } = useSupabase()
     const { addNotification } = useNotification()
     const [message, _] = useState<string>("")
     const checkUsernameAvailable = async (username: string) => {
          const { data } = await supabase
               .from("profiles")
               .select("*")
               .eq("username", username)
               .single()
          if (data) {
               return false
          }
          return true
     }
     const handleSubmitNewUsername = async (e: FormEvent<HTMLFormElement>) => {
          e.preventDefault()
          const available = await checkUsernameAvailable(newUsername)
          if (!available) {
               addNotification("username already taken", {
                    status: "error",
                    position: "top",
               })
               return
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
                                             mainUser.updateUser(data)
                                        }
                                   })
                         }
                    })
               onClose()
          }
     }
     return (
          <form className="p-4" onSubmit={(e) => handleSubmitNewUsername(e)}>
               <FormControl>
                    <FormLabel className="text-whitney text-xl ">
                         Username
                    </FormLabel>
                    <input
                         placeholder="Your New Username"
                         className="search-input w-full"
                         value={newUsername}
                         onChange={(e) => setUsername(e.target.value)}
                    />
               </FormControl>
               <FormErrorMessage>
                    {message ? "username already taken" : ""}
               </FormErrorMessage>
               <div className="mt-4  m-auto">
                    <button
                         type="submit"
                         className="button w-full text-lg rounded bg-green"
                    >
                         Submit
                    </button>
               </div>
          </form>
     )
}
