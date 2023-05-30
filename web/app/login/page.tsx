"use client";
import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useObject } from "@/hooks/useObject";
import { useUser } from "@/hooks/useUser";
import { BsDiscord, BsGithub, BsGoogle } from "react-icons/bs";
import { useSupabase } from "../supabase-provider";
import { useState } from "react";

export const AccountProviders = {
     discord: {
          color: "blue-500",
          Icon: BsDiscord,
     },
     github: {
          color: "slate-500",
          Icon: BsGithub,
     },
     google: {
          color: "red-500",
          Icon: BsGoogle,
     },
} as const;
export type AccountProviderType = keyof typeof AccountProviders;
export default function LOGINPAGE() {
     const [state, setState] = useObject({
          email: "",
          password: "",
     });
     const user = useUser();
     const supabase = useSupabase();

     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          setState({
               [e.target.name]: e.target.value,
          });
     };
     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          await user.logout();
          await user.login(state.email, state.password);
          // if (typeof window !== "undefined") {
          //   window.location.href = "/";
          // }
     };
     const handleProviderSignIn = async (provider: AccountProviderType) => {
          await supabase.supabase.auth.signInWithOAuth({
               provider: provider,
          });
     };
     return (
          <div className="flex items-center h-[80vh]">
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
               className={`bg-${color} hover:cursor-pointer rounded-md flex py-2 justify-center`}
          >
               <Icon />
          </div>
     );
};
