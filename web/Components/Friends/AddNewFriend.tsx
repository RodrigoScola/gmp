"use client";
import { IFriend, IUser } from "@/../shared/src/types/users";
import { useFriend } from "@/hooks/useFriends";
import { useUser } from "@/hooks/useUser";
import { usersSocket } from "@/lib/socket";
import {
     Button,
     Popover,
     PopoverContent,
     PopoverTrigger,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
var timer: NodeJS.Timeout;
export const AddNewFriend = () => {
     const [searchTerm, setSearchTerm] = useState<string>("a");
     const { user } = useUser();
     const [resultFriends, setResultFriends] = useState<IFriend[]>([]);
     const handleSubmit = (e: { preventDefault: () => void }) => {
          e.preventDefault();
     };
     const { sendFriendRequest } = useFriend();
     const handleChange = (term: string) => {
          setSearchTerm(term);
     };

     useEffect(() => {
          if (!usersSocket.connected) {
               usersSocket.auth = {
                    user: user,
               };
               usersSocket.connect();
          }
     }, []);
     useEffect(() => {
          let es = searchTerm;
          if (timer) {
               clearTimeout(timer);
          }
          timer = setTimeout(() => {
               if (es == searchTerm && searchTerm !== "") {
                    usersSocket.emit(
                         "search_users",
                         searchTerm,
                         (data: IUser[]) => {
                              console.log(data);
                              setResultFriends(data as IFriend[]);
                         }
                    );
               }
          }, 500);
     }, [searchTerm]);
     return (
          <Popover isLazy defaultIsOpen>
               <PopoverTrigger>
                    <Button>Add New</Button>
               </PopoverTrigger>
               <PopoverContent className="px-2 ">
                    <form onSubmit={handleSubmit} className="flex flex-row">
                         <label className="flex flex-col">
                              Username
                              <input
                                   value={searchTerm}
                                   onChange={(e) =>
                                        handleChange(e.target.value)
                                   }
                              />
                         </label>
                         <button>Search</button>
                    </form>
                    <div className="flex flex-col gap-2 ">
                         {resultFriends.map((friend: IFriend) => (
                              <div
                                   key={friend.id}
                                   onClick={() => sendFriendRequest(friend.id)}
                                   className="flex hover:bg-gray-400 px-1"
                              >
                                   <p className="capitalize">
                                        {friend.username}
                                   </p>
                              </div>
                         ))}
                    </div>
               </PopoverContent>
          </Popover>
     );
};
