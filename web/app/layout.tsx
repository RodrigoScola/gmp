import { Nav } from "@/Components/Nav";
import { FriendsProvider } from "@/hooks/useFriends";
import "./globals.css";
import { Providers } from "./providers";
import SupabaseProvider from "./supabase-provider";

export const metadata = {
     title: "Create Next App",
     description: "Generated by create next app",
};

export default function RootLayout({
     children,
     ...props
}: {
     children: React.ReactNode;
     props: any;
}) {
     return (
          <html lang="en">
               <body className="bg-blue-1000">
                    <SupabaseProvider>
                         <FriendsProvider>
                              <Providers {...props}>
                                   <Nav />
                                   <div className="max-w-6xl z-10 m-auto">
                                        {children}
                                   </div>
                              </Providers>
                         </FriendsProvider>
                         <div className="fixed h-96 -z-50 w-screen bottom-0 bg-gradient-to-t from-white/10 to-blue-1000"></div>
                    </SupabaseProvider>
               </body>
          </html>
     );
}
