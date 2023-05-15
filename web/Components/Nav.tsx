"use client";

import { useUser } from "@/hooks/useUser";
import Link from "next/link";
import FriendsMenu from "./Menu/FriendsMenu";
import { Drawer } from "./Drawer/Drawer";
import { useDisclosure } from "@/hooks/useDisclosure";
import { AiOutlineMenu } from "react-icons/ai";
import { useEffect } from "react";
import { useEffectOnce } from "usehooks-ts";
import { useNotifications } from "@/hooks/useToast";

export const Nav = () => {
  const { user } = useUser();
  const { isOpen, onClose, onOpen } = useDisclosure();
  useNotifications();
  return (
    <div className="flex justify-between px-5 w-screen ">
      <Link href={`/`}>click me to go back</Link>

      <Drawer
        onClose={onClose}
        onOpen={onOpen}
        isOpen={isOpen}
        TriggerElement={<AiOutlineMenu size={30} />}
      >
        {user && (
          <Link onClick={onClose} href={`/user/${user.username}`}>
            Profile
          </Link>
        )}
        <FriendsMenu
          disclosure={{
            onClose,
            onOpen,
            isOpen,
          }}
        />
      </Drawer>
    </div>
  );
};
