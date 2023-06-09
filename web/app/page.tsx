"use client";
import { FriendsTab } from "@/Components/tabs/FriendsTab";
import { useUser } from "@/hooks/useUser";
import Link from "next/link";
import { useEffect, useState } from "react";

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
     return (
          <div className="flex flex-row px-12 ">
               <div className="flex flex-col items-center justify-center text-white w-full h-fit">
                    <div className="font-ginto flex flex-col justify-center items-center text-5xl">
                         <p className="font-ginto font-bold">The Game Zone</p>
                         <Link
                              className="border w-full text-center border-none button bg-white mt-2 text-gray-700 font-semibold noselect font-uni-sans text-2xl rounded-md "
                              href={"/play"}
                         >
                              Play a Game
                         </Link>
                    </div>
               </div>
               <FriendsTab friends={friends} />
          </div>
     );
}
