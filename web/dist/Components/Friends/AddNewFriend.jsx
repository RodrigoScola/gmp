"use client";
import { useFriend } from "@/hooks/useFriends";
import { useUser } from "@/hooks/useUser";
import { usersSocket } from "@/lib/socket";
import { Search2Icon } from "@chakra-ui/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@chakra-ui/react";
import { useEffect, useState } from "react";
var timer;
export const AddNewFriend = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const { user } = useUser();
    const [resultFriends, setResultFriends] = useState([]);
    const handleSubmit = (e) => {
        e.preventDefault();
    };
    const { sendFriendRequest } = useFriend();
    const handleChange = (term) => {
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
                usersSocket.emit("search_users", searchTerm, (data) => {
                    console.log(data);
                    setResultFriends(data);
                });
            }
        }, 500);
    }, [searchTerm]);
    return (<Popover isLazy>
               <PopoverTrigger>
                    <button className="button bg-white text-gray-700 w-full">
                         Add Friend
                    </button>
               </PopoverTrigger>
               <PopoverContent className="px-2  bg-gray-700 w-fit ">
                    <form onSubmit={handleSubmit} className="flex flex-row">
                         <label className="flex flex-col">
                              Username
                              <div className="bg-gray-800 rounded-md my-2 pr-4">
                                   <input className="search-input " value={searchTerm} placeholder="Examplename123" onChange={(e) => handleChange(e.target.value)}/>
                                   <button>
                                        <Search2Icon className="text-white/80 pb-1"/>
                                   </button>
                              </div>
                         </label>
                    </form>
                    <div className="flex flex-col gap-2 ">
                         {resultFriends.length !== 0 && (<p className="font-whitney font-medium">Users</p>)}
                         {resultFriends.map((friend) => (<div key={friend.id} onClick={() => sendFriendRequest(friend.id)} className="flex hover:bg-gray-400 px-1 hover:font-bold">
                                   <p className="capitalize font-medium  cursor-pointer">
                                        {friend.username}
                                   </p>
                              </div>))}
                    </div>
               </PopoverContent>
          </Popover>);
};
