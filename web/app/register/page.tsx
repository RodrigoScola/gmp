"use client";
import {
     AccountProviderType,
     AccountProviders,
     ProviderButton,
} from "@/Components/accountProviders/AccountProviderButtons";
import { baseUrl } from "@/constants";
import { useNotification } from "@/hooks/useToast";
import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { FormEvent, useState } from "react";
import { useSupabase } from "../supabase-provider";

export default function REGISTERPAGE() {
     const { supabase } = useSupabase();
     const [data, setData] = useState({
          email: "",
          password: "",
          username: "",
     });
     const { addNotification } = useNotification();
     const handleSignUpProvider = async (
          provider: AccountProviderType
     ): Promise<void> => {
          await supabase.auth.signInWithOAuth({
               provider: provider,
               options: {
                    redirectTo: `${baseUrl}/login`,
               },
          });
     };
     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          setData((current) => ({
               ...current,
               [e.target.name]: e.target.value,
          }));
     };
     const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          if (
               data.email === "" ||
               data.password === "" ||
               data.username === ""
          ) {
               return;
          }
          const { error, data: usernameTaken } = await supabase
               .from("profiles")
               .select("username")
               .eq("username", data.username)
               .maybeSingle();
          if (error) {
               console.log(error);
               addNotification(error.message, {
                    position: "top",
                    status: "error",
               });
          }
          if (usernameTaken) {
               addNotification("username is unavailable", {
                    position: "top",
                    status: "warning",
               });
               return;
          }
          const { data: signupdata } = await supabase.auth.signUp({
               email: data.email,
               password: data.password,
          });
          if (signupdata.user) {
               await supabase.from("profiles").insert({
                    email: data.email,
                    id: signupdata.user.id,
                    username: data.username,
               });

               addNotification("Account Created!");
               const a = await supabase.auth.signInWithPassword({
                    email: data.email,
                    password: data.password,
               });
               console.log(a);
               setTimeout(() => {
                    window.location.href = `/`;
               });
          }
     };
     return (
          <div className="h-[80vh]  flex">
               <div className="w-fit m-auto  p-3 rounded-lg">
                    <form onSubmit={handleSignUp} className="flex flex-col">
                         <FormControl>
                              <FormLabel>
                                   <p>Email</p>
                              </FormLabel>
                              <Input
                                   name="email"
                                   value={data.email}
                                   onChange={handleChange}
                                   required
                                   type="email"
                              />
                         </FormControl>
                         <FormControl>
                              <FormLabel>
                                   <p>Password</p>
                              </FormLabel>
                              <Input
                                   name="password"
                                   value={data.password}
                                   onChange={handleChange}
                                   required
                                   type="password"
                              />
                         </FormControl>
                         <FormControl>
                              <FormLabel>
                                   <p>Username</p>
                              </FormLabel>
                              <Input
                                   name="username"
                                   value={data.username}
                                   onChange={handleChange}
                                   required
                                   type="text"
                              />
                         </FormControl>
                         <div className="m-auto pt-2">
                              <Button
                                   variant={"outline"}
                                   colorScheme="whatsapp"
                                   type="submit"
                              >
                                   Register
                              </Button>
                         </div>
                    </form>
                    <div className="gap-2 flex flex-col pt-5">
                         {Object.keys(AccountProviders).map((provider) => (
                              <ProviderButton
                                   key={provider}
                                   handleClick={handleSignUpProvider}
                                   provider={provider as AccountProviderType}
                              />
                         ))}
                    </div>
               </div>
          </div>
     );
}
