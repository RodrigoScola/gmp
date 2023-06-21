"use client";
import {
     AccountProviderType,
     AccountProviders,
} from "@/Components/accountProviders/AccountProviderButtons";
import { baseUrl } from "@/constants";
import { useObject } from "@/hooks/useObject";
import { useNotification } from "@/hooks/useToast";
import { useUser } from "@/hooks/useUser";
import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSupabase } from "../supabase-provider";
const ProviderButton = dynamic(() =>
     import("@/Components/accountProviders/AccountProviderButtons").then(
          (r) => r.ProviderButton
     )
);

export default function LOGINPAGE() {
     const [state, setState] = useObject({
          email: "",
          password: "",
     });

     const mainUser = useUser();
     const { supabase } = useSupabase();
     const { addNotification } = useNotification();
     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          setState({
               [e.target.name]: e.target.value,
          });
     };
     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          await mainUser.logout();

          const data = await mainUser.login(state.email, state.password);
          if (data) {
               window.location.href = process.env.SITE_URL ?? "/";
          } else {
               addNotification("invalid credentials", {
                    status: "warning",
                    position: "top",
               });
          }
     };
     const handleProviderSignIn = async (provider: AccountProviderType) => {
          await supabase.auth.signInWithOAuth({
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
                                   className="border-2"
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
                                   className="border-2"
                                   onChange={handleChange}
                                   name="password"
                                   value={state.password}
                                   type="password"
                              />
                         </FormControl>
                    </div>
                    <div className="py-3 w-full flex">
                         <Button
                              w={"full"}
                              variant={"outline"}
                              colorScheme="whatsapp"
                              className="py-5"
                              type="submit"
                         >
                              login
                         </Button>
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
                    <div className="flex justify-center flex-col pt-2">
                         <div className="text-center ">
                              <p>Dont have an account yet? </p>
                              <Link
                                   className="text-center"
                                   href={`${baseUrl}/register`}
                              >
                                   Click here
                              </Link>
                         </div>
                    </div>
               </form>
          </div>
     );
}
