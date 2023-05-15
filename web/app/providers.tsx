"use client";

import { NotificationProvider } from "@/hooks/useToast";
import { UserProvider } from "@/hooks/useUser";
import { ChildrenType } from "@/types";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";

export function Providers({ children }: { children: ChildrenType }) {
  return (
    <CacheProvider>
      <ChakraProvider>
        <NotificationProvider>
          <UserProvider>{children}</UserProvider>
        </NotificationProvider>
      </ChakraProvider>
    </CacheProvider>
  );
}
