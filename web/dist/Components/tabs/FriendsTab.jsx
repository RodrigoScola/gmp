"use client";
import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import { AddNewFriend } from "../Friends/AddNewFriend";
import { FriendCard } from "../Friends/FriendsComponents";
export const FriendsTab = (props) => {
    const { user } = useUser();
    const [canShow, setCanShow] = useState(false);
    useEffect(() => {
        if (canShow == false && user !== null) {
            setCanShow(true);
        }
    }, [user]);
    return (<>
               {canShow && (<div className=" rounded-md h-fit shadow-md mt-2 bg-gray-800/80 p-2 w-64 ">
                         <div className="shadow-sm border-b-2 justify-self-end pb-2   border-gray-800/40">
                              <AddNewFriend />
                         </div>
                         <div className=" flex flex-col gap-2 mt-2 ">
                              {props.friends.map((friend) => {
                return (<FriendCard key={friend.id} friend={friend}/>);
            })}
                         </div>
                    </div>)}
          </>);
};
