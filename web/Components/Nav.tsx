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
    <div className="bg-warmGray-50 w-[30vw] px-6 rounded-full  m-auto ">
      <nav className="flex justify-between m-auto  items-center py-2 flex-row">
        <Link className="text-4xl text-blue-900" href={`/`}>
          <Heading>TGZ</Heading>
        </Link>
        <div className="text-blue-900">
          {user ? (
            <Link className="" href={`/user/${user.username}`}>
              <Text className="font-bold capitalize">{user.username}</Text>
            </Link>
          ) : (
            <div className="inline-flex gap-2 border border-blue-900 bg-blue-900 text-warmGray-50 ">
              <button>login</button>
              <button>create an account</button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};
