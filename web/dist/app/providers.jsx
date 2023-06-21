"use client";
import { NotificationProvider } from "@/hooks/useToast";
import { UserProvider } from "@/hooks/useUser";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, extendTheme, ThemeProvider } from "@chakra-ui/react";
const config = {
    initialColorMode: "dark",
    useSystemColorMode: false,
};
const theme = extendTheme({ config });
export function Providers({ children }) {
    return (<NotificationProvider>
               <CacheProvider>
                    <ThemeProvider theme={theme}>
                         <ChakraProvider resetCSS={false}>
                              <UserProvider>{children}</UserProvider>
                         </ChakraProvider>
                    </ThemeProvider>
               </CacheProvider>
          </NotificationProvider>);
}
