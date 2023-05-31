"use client";

import { IFriend, IUser } from "@/../shared/src/types/users";
import { usersSocket } from "@/lib/socket";
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useFriend } from "@/hooks/useFriends";
import {
     Button,
     Popover,
     PopoverContent,
     PopoverTrigger,
} from "@chakra-ui/react";
var timer: NodeJS.Timeout;
export const AddNewFriend = () => {
     const [searchTerm, setSearchTerm] = useState<string>("");
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
          return () => {
               if (usersSocket.connected) usersSocket.disconnect();
          };
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
                              setResultFriends(data as IFriend[]);
                         }
                    );
               }
          }, 500);
     }, [searchTerm]);
     return (
          <Popover>
               <PopoverTrigger>
                    <Button>Add New</Button>
               </PopoverTrigger>
               <PopoverContent>
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
                    <div>
                         {resultFriends.map((friend: IFriend) => (
                              <div key={friend.id}>
                                   <div>{friend.username}</div>

                                   <button
                                        onClick={() => {
                                             sendFriendRequest(friend.id);
                                        }}
                                   >
                                        add friend
                                   </button>
                              </div>
                         ))}
                    </div>
               </PopoverContent>
          </Popover>
     );
};
