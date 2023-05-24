"use client";

import { useUser } from "@/hooks/useUser";
import Link from "next/link";
import { useNotifications } from "@/hooks/useToast";
import { Text, Heading, useColorMode } from "@chakra-ui/react";
import { useEffectOnce } from "usehooks-ts";

export const Nav = () => {
  const { user } = useUser();
  useNotifications();

  const { colorMode, setColorMode } = useColorMode();
  useEffectOnce(() => {
    if (colorMode == "light") {
      setColorMode("dark");
    }
  });
  return (
    <div className="  bg-blue-900 w-screen ">
      <nav className="flex justify-around m-auto w-[90%] items-center py-2 flex-row">
        <Link className="text-4xl" href={`/`}>
          <Heading>TGZ</Heading>
        </Link>
        <div>
          {user.id ? (
            <Link href={`/user/${user.username}`}>
              <Text className="font-bold capitalize">{user.username}</Text>
            </Link>
          ) : null}
        </div>
      </nav>
    </div>
  );
};
