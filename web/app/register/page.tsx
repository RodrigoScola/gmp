"use client";
import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import {
     AccountProviderType,
     AccountProviders,
     ProviderButton,
} from "../login/page";
import { useSupabase } from "../supabase-provider";

export default function REGISTERPAGE(a) {
     console.log(a);
     const { supabase } = useSupabase();
     const handleSignUpProvider = async (
          provider: AccountProviderType
     ): Promise<void> => {
          const res = await supabase.auth.signInWithOAuth({
               provider: provider,
               options: {
                    redirectTo: "http://localhost:3000/register",
               },
          });

          console.log(res);
     };
     return (
          <div className="w-fit m-auto  p-3 rounded-lg">
               <form className="flex flex-col">
                    <FormControl>
                         <FormLabel>
                              <p>Email</p>
                         </FormLabel>
                         <Input type="email" />
                    </FormControl>
                    <FormControl>
                         <FormLabel>
                              <p>Username</p>
                         </FormLabel>
                         <Input type="email" />
                    </FormControl>
                    <FormControl>
                         <FormLabel>
                              <p>Password</p>
                         </FormLabel>
                         <Input type="password" />
                    </FormControl>
                    <FormControl>
                         <FormLabel>
                              <p>Confirm Password</p>
                         </FormLabel>
                         <Input type="password" />
                    </FormControl>
                    <div className="m-auto">
                         <Button type="submit">Register</Button>
                    </div>
               </form>
               <div className="gap-2 flex flex-col pt-5">
                    {Object.keys(AccountProviders).map((provider) => (
                         <ProviderButton
                              handleClick={handleSignUpProvider}
                              provider={provider as AccountProviderType}
                         />
                    ))}
               </div>
          </div>
     );
}
