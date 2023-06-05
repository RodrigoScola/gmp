"use client";
import { AddNewFriend } from "@/Components/Friends/AddNewFriend";
import { FriendsList } from "@/Components/Friends/FriendsComponents";
import Link from "next/link";
import { useUser } from "../hooks/useUser";

export default function Home() {
     const { friends, isLoggedIn } = useUser();
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
                         <FriendsList friends={friends} />
                    </div>
               ) : (
                    <div></div>
               )}
          </div>
     );
}
