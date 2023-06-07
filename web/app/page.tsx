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
               <div className="flex flex-col text-white w-full h-fit">
                    <div className="w-fit m-auto font-ginto text-5xl">
                         <p className="font-ginto font-bold">The Game Zone</p>
                    </div>
                    <div className=" m-auto w-fit ">
                         <Link
                              className="border font-uni-sans text-2xl rounded-md "
                              href={"/play"}
                         >
                              Play a GAME
                         </Link>
                    </div>
               </div>
               <FriendsTab friends={friends} />
          </div>
     );
}
