"use client";
import { IFriend } from "@/../shared/src/types/users";
import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import { AddNewFriend } from "../Friends/AddNewFriend";
import { FriendCard } from "../Friends/FriendsComponents";
export const FriendsTab = (props: { friends: IFriend[] }) => {
     const { user } = useUser();

     const [canShow, setCanShow] = useState(false);
     useEffect(() => {
          if (canShow == false && user !== null) {
               setCanShow(true);
          }
     }, [user]);
     return (
          <>
               {canShow && (
                    <div className="justify-self-end mt-2 bg-gray-700/80 lg:w-64">
                         <div className="shadow-sm border-b-2 justify-self-end   border-gray-800/40">
                              <AddNewFriend />
                         </div>
                         <div className=" flex flex-col gap-2 ">
                              {props.friends.map((friend) => {
                                   return (
                                        <FriendCard
                                             key={friend.id}
                                             friend={friend}
                                        />
                                   );
                              })}
                         </div>
                    </div>
               )}
          </>
     );
};
