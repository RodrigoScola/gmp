"use client";
import { FriendsList } from "@/Components/Friends/FriendsComponents";
import { useFriends } from "@/hooks/useFriends";
import { useUser } from "@/hooks/useUser";
// import { getUrl } from "@/lib/utils";
import { AddNewFriend } from "@/Components/Friends/AddNewFriend";
import Link from "next/link";
import { useState } from "react";
import { useEffectOnce } from "usehooks-ts";
import { IFriend } from "../../shared/src/types/users";
export default function Home() {
     const { user, isLoggedIn } = useUser();
     const [userFriends, setFriends] = useState<IFriend[]>([]);
     const friends = useFriends();
     useEffectOnce(() => {
          if (!user) return;
          friends?.getFriends(user.id).then((friends) => {
               setFriends(friends);
          });
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
