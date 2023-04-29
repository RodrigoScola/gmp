"use client";

import { ToastProvider } from "@/hooks/useToast";
import { UserProvider } from "@/hooks/useUser";
import { ChildrenType } from "@/types";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";

export function Providers({ children }: { children: ChildrenType }) {
  return (
    <CacheProvider>
      <ChakraProvider>
        <UserProvider>
          <ToastProvider>{children}</ToastProvider>
        </UserProvider>
      </ChakraProvider>
    </CacheProvider>
  );
}
