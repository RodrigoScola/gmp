"use client";
import { NotificationProvider } from "@/hooks/useToast";
import { UserProvider } from "@/hooks/useUser";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, ThemeProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
const config = {
    initialColorMode: "light",
    useSystemColorMode: false,
};
const theme = extendTheme({ config });
export function Providers({ children }) {
    return (<CacheProvider>
      <ThemeProvider theme={theme}>
        <ChakraProvider>
          <NotificationProvider>
            <UserProvider>{children}</UserProvider>
          </NotificationProvider>
        </ChakraProvider>
      </ThemeProvider>
    </CacheProvider>);
}
