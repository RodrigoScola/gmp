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
                    <div>
                         <AddNewFriend />
                         <div className="flex flex-col gap-4 ">
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
