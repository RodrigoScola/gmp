"use client";
import { FriendsTab } from "@/Components/tabs/FriendsTab";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from "../hooks/useUser";

export default function DEFUALHOME() {
     const { friends, user, getFriends } = useUser();

     useEffect(() => {
          getFriends();
     }, []);

     const [canShow, setCanShow] = useState(false);

     useEffect(() => {
          if (canShow == false && user !== null) {
               setCanShow(true);
          }
     }, [user]);
     console.log(friends);
     return (
          <div className="flex flex-row">
               <div className="flex flex-col text-white w-full h-fit">
                    <div className="w-fit m-auto text-5xl">
                         <h1>The Game Zone</h1>
                    </div>
                    <div className=" m-auto w-fit ">
                         <Link className="border rounded-md " href={"/play"}>
                              Play a game
                         </Link>
                    </div>
               </div>
               <div>
                    <FriendsTab friends={friends} />
               </div>
          </div>
     );
}
