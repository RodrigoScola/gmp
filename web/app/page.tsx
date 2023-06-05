"use client";
import { AddNewFriend } from "@/Components/Friends/AddNewFriend";
import { FriendsList } from "@/Components/Friends/FriendsComponents";
import { userSocket } from "@/lib/socket";
import Link from "next/link";
import { useState } from "react";
import { useEffectOnce } from "usehooks-ts";
import { IFriend } from "../../shared/src/types/users";
import { useUser } from "../hooks/useUser";

export default function Home() {
     const { user, isLoggedIn, getFriends } = useUser();
     const [userFriends, setFriends] = useState<IFriend[]>([]);

     const getInformation = async () => {
          if (!user) return;
          const f = await getFriends();
          if (f?.length) {
               setFriends(f);
          }
     };
     console.table(userSocket);
     console.log(userSocket.connected);
     useEffectOnce(() => {
          getInformation();
     });
     return (
          <div className="flex flex-row">
               <div className="flex flex-col text-white w-screen h-screen">
                    <div className="w-fit m-auto text-5xl">
                         <h1>The Game Zone</h1>
                    </div>
                    <div className=" m-auto w-fit mt-10">
                         <Link className="border rounded-md p-2" href={"/play"}>
                              Play a game
                         </Link>
                    </div>
               </div>
               {isLoggedIn ? (
                    <div>
                         <AddNewFriend />
                         <FriendsList friends={userFriends} />
                    </div>
               ) : (
                    <div></div>
               )}
          </div>
     );
}
