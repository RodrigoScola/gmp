"use client";
import { Drawer } from "@/Components/Drawer/Drawer";
import { DrawerFooter } from "@/Components/Drawer/DrawerFooter";
import { FriendsList } from "@/Components/Friends/FriendsComponents";
import {
  Popover,
  PopoverTrigger,
  useDisclosure,
  PopoverContent,
} from "@chakra-ui/react";

type FriendsMenuProps = {
  disclosure: Partial<ReturnType<typeof useDisclosure>>;
};

export default function FriendsMenu(props: FriendsMenuProps) {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const handleCloseMenu = () => {
    if (props.disclosure.onClose) {
      props.disclosure.onClose();
    }
    onClose();
  };
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
                  <input />
                </label>
                <button>Search</button>
              </form>
            </PopoverContent>
          </Popover>
        </div>
        <FriendsList />
        <DrawerFooter>
          <button onClick={onClose}>Cancel</button>
        </DrawerFooter>
      </Drawer>
    </div>
  );
}
