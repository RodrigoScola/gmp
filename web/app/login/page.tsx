"use client";
import {
     Button,
     FormControl,
     FormLabel,
     Input,
     Modal,
     ModalBody,
     ModalCloseButton,
     ModalContent,
     ModalHeader,
     ModalOverlay,
} from "@chakra-ui/react";
import { useObject } from "@/hooks/useObject";
import { useUser } from "@/hooks/useUser";
import { BsDiscord, BsGithub, BsGoogle } from "react-icons/bs";
import { useSupabase } from "../supabase-provider";
import { useState } from "react";
import { ChangeUsernameComponent } from "@/Components/ChangeUsername";
import { User } from "@supabase/auth-helpers-nextjs";
import { useEffectOnce } from "usehooks-ts";

export const AccountProviders = {
     discord: {
          color: "bg-blue-500",
          Icon: BsDiscord,
     },
     github: {
          color: "bg-slate-500",
          Icon: BsGithub,
     },
     google: {
          color: "bg-red-500",
          Icon: BsGoogle,
     },
} as const;
export type AccountProviderType = keyof typeof AccountProviders;
export default function LOGINPAGE() {
     const [state, setState] = useObject({
          email: "",
          password: "",
     });

     const [canSetUsername, setCanSetUsername] = useState<boolean>(false);
     const mainUser = useUser();
     const [currentUser, setCurrentUser] = useState<User | null>(null);
     const supabase = useSupabase();

     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          setState({
               [e.target.name]: e.target.value,
          });
     };
     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          await mainUser.logout();
          await mainUser.login(state.email, state.password);
     };
     const handleProviderSignIn = async (provider: AccountProviderType) => {
          await supabase.supabase.auth.signInWithOAuth({
               provider: provider,
               options: {
                    redirectTo: "http://localhost:3000/login",
               },
          });
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
                                   mainUser.updateUser(data);
                              }
                         });
               }
          });
     });
     return (
          <div className="flex items-center h-[80vh]">
               <Modal
                    onClose={() => setCanSetUsername(false)}
                    isOpen={canSetUsername}
               >
                    <ModalOverlay />
                    <ModalContent>
                         <ModalHeader>Set Username</ModalHeader>
                         <ModalCloseButton />
                         <ModalBody>
                              <ChangeUsernameComponent
                                   currentUser={currentUser}
                              />
                         </ModalBody>
                    </ModalContent>
               </Modal>
               <form className="m-auto w-fit" onSubmit={handleSubmit}>
                    <div>
                         <FormControl>
                              <FormLabel>Email</FormLabel>
                              <Input
                                   className="border-0"
                                   onChange={handleChange}
                                   name="email"
                                   value={state.email}
                                   type="email"
                              />
                         </FormControl>
                         <FormControl>
                              <FormLabel className="flex flex-col">
                                   Password
                              </FormLabel>
                              <Input
                                   className="border-0"
                                   onChange={handleChange}
                                   name="password"
                                   value={state.password}
                                   type="password"
                              />
                         </FormControl>
                    </div>
                    <div className="gap-2 pt-3 flex flex-col">
                         {Object.keys(AccountProviders).map((provider) => {
                              return (
                                   <ProviderButton
                                        key={provider}
                                        provider={
                                             provider as AccountProviderType
                                        }
                                        handleClick={handleProviderSignIn}
                                   />
                              );
                         })}
                    </div>
                    <div className="flex justify-center pt-2">
                         <Button type="submit">login</Button>
                    </div>
               </form>
          </div>
     );
}

export const ProviderButton = ({
     handleClick,
     provider,
}: {
     provider: AccountProviderType;
     handleClick: (provider: AccountProviderType) => Promise<void>;
}) => {
     const [{ color, Icon }, _] = useState(AccountProviders[provider]);
     return (
          <div
               onClick={() => handleClick(provider)}
               className={`${color} hover:cursor-pointer rounded-md flex py-2 justify-center`}
          >
               <Icon />
          </div>
     );
};
