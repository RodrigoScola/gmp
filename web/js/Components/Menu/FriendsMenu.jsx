"use client";
import { Drawer } from "@/Components/Drawer/Drawer";
import { DrawerFooter } from "@/Components/Drawer/DrawerFooter";
import { FriendsList } from "@/Components/Friends/FriendsComponents";
import { useFriend, useFriends } from "@/hooks/useFriends";
import { useUser } from "@/hooks/useUser";
import { usersSocket } from "@/lib/socket";
import { Popover, PopoverTrigger, useDisclosure, PopoverContent, } from "@chakra-ui/react";
import { useEffect, useState } from "react";
var timer;
export default function FriendsMenu(props) {
    const { isOpen, onToggle, onClose } = useDisclosure();
    const handleSubmit = (e) => {
        e.preventDefault();
    };
    const [friends, setFriends] = useState([]);
    const { user } = useUser();
    const [searchTerm, setSearchTerm] = useState("");
    const f = useFriends();
    const { sendFriendRequest } = useFriend();
    const go = async () => {
        const x = await f?.getFriends(user.id);
        if (x)
            setFriends(x);
    };
    useEffect(() => {
        if (user.id) {
            go();
        }
    }, []);
    const [resultFriends, setResultFriends] = useState([]);
    const handleCloseMenu = () => {
        if (props.disclosure.onClose) {
            props.disclosure.onClose();
        }
        onClose();
    };
    const handleChange = (term) => {
        setSearchTerm(term);
    };
    useEffect(() => {
        let es = searchTerm;
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            if (es == searchTerm && searchTerm !== "") {
                usersSocket.emit("search_users", searchTerm, (data) => {
                    setResultFriends(data);
                });
            }
        }, 500);
    }, [searchTerm]);
    return (<div>
      <Drawer onClose={handleCloseMenu} isOpen={isOpen} onOpen={onToggle} TriggerElement={<div>
            <h3>Friends</h3>
          </div>}>
        <div className="flex">
          <Popover>
            <PopoverTrigger>
              <div>Add new</div>
            </PopoverTrigger>

            <PopoverContent className={"relative z-50 border border-black"}>
              <form onSubmit={handleSubmit} className="flex flex-row">
                <label className="flex flex-col">
                  Username
                  <input value={searchTerm} onChange={(e) => handleChange(e.target.value)}/>
                </label>
                <button>Search</button>
              </form>
              <div>
                {resultFriends.map((friend) => (<div key={friend.id}>
                    <div>{friend.username}</div>

                    <button onClick={() => {
                sendFriendRequest(friend.id);
            }}>
                      add friend
                    </button>
                  </div>))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <FriendsList friends={friends}/>
        <DrawerFooter>
          <button onClick={onClose}>Cancel</button>
        </DrawerFooter>
      </Drawer>
    </div>);
}
