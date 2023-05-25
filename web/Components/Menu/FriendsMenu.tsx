"use client";
import { Drawer } from "@/Components/Drawer/Drawer";
import { DrawerFooter } from "@/Components/Drawer/DrawerFooter";
import { FriendsList } from "@/Components/Friends/FriendsComponents";
import { useFriend, useFriends } from "@/hooks/useFriends";
import { useUser } from "@/hooks/useUser";
import { usersSocket } from "@/lib/socket";
import { IFriend, IUser } from "../../../shared/src/types/users";
import {
  Popover,
  PopoverTrigger,
  useDisclosure,
  PopoverContent,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

type FriendsMenuProps = {
  disclosure: Partial<ReturnType<typeof useDisclosure>>;
};

var timer: NodeJS.Timeout;

export default function FriendsMenu(props: FriendsMenuProps) {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
  };
  const [friends, setFriends] = useState<IFriend[]>([]);
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const f = useFriends();
  console.log(f);
  const { sendFriendRequest } = useFriend();
  const go = async () => {
    const x = await f?.getFriends(user.id);
    if (x) setFriends(x);
  };

  useEffect(() => {
    if (user.id) {
      go();
    }
  }, []);

  const [resultFriends, setResultFriends] = useState<IFriend[]>([]);
  const handleCloseMenu = () => {
    if (props.disclosure.onClose) {
      props.disclosure.onClose();
    }
    onClose();
  };
  const handleChange = (term: string) => {
    setSearchTerm(term);
  };
  useEffect(() => {
    let es = searchTerm;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      if (es == searchTerm && searchTerm !== "") {
        usersSocket.emit("search_users", searchTerm, (data: IUser[]) => {
          setResultFriends(data as IFriend[]);
        });
      }
    }, 500);
  }, [searchTerm]);
  return (
    <div>
      <Drawer
        onClose={handleCloseMenu}
        isOpen={isOpen}
        onOpen={onToggle}
        TriggerElement={
          <div>
            <h3>Friends</h3>
          </div>
        }
      >
        <div className="flex">
          <Popover>
            <PopoverTrigger>
              <div>Add new</div>
            </PopoverTrigger>

            <PopoverContent className={"relative z-50 border border-black"}>
              <form onSubmit={handleSubmit} className="flex flex-row">
                <label className="flex flex-col">
                  Username
                  <input
                    value={searchTerm}
                    onChange={(e) => handleChange(e.target.value)}
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
        </div>
        <FriendsList friends={friends} />
        <DrawerFooter>
          <button onClick={onClose}>Cancel</button>
        </DrawerFooter>
      </Drawer>
    </div>
  );
}
