"use client";
import { Drawer } from "@/Components/Drawer/Drawer";
import { DrawerFooter } from "@/Components/Drawer/DrawerFooter";
import { FriendsList } from "@/Components/Friends/FriendsComponents";
import { useFriends } from "@/hooks/useFriends";
import { useUser } from "@/hooks/useUser";
import { useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AddNewFriend } from "../Friends/AddNewFriend";
export default function FriendsMenu(props) {
    const { isOpen, onToggle, onClose } = useDisclosure();
    const [friends, setFriends] = useState([]);
    const { user } = useUser();
    const f = useFriends();
    console.log(f);
    const go = async () => {
        if (!user)
            return;
        const x = await f?.getFriends(user.id);
        if (x)
            setFriends(x);
    };
    useEffect(() => {
        if (user) {
            go();
        }
    }, []);
    const handleCloseMenu = () => {
        if (props.disclosure?.onClose) {
            props.disclosure?.onClose();
        }
        onClose();
    };
    return (<div>
               <Drawer onClose={handleCloseMenu} isOpen={isOpen} onOpen={onToggle} TriggerElement={<div>
                              <h3>Friends</h3>
                         </div>}>
                    <div className="flex">
                         <AddNewFriend />
                    </div>
                    <FriendsList friends={friends}/>
                    <DrawerFooter>
                         <button onClick={onClose}>Cancel</button>
                    </DrawerFooter>
               </Drawer>
          </div>);
}
