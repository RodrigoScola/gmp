import { FriendsProvider } from "@/hooks/useFriends";
import "./globals.css";

import { Nav } from "@/Components/Nav";
import localFont from "@next/font/local";
import { Providers } from "./providers";
import SupabaseProvider from "./supabase-provider";

export const metadata = {
     title: "The Game Zone",
     description: "A Zone for gaming with friends",
};

export const whitney = localFont({
     src: [
          {
               path: "../font/whitneybook.otf",
               weight: "400",
          },
          {
               path: "../font/whitneybookitalic.otf",
               weight: "400",
               style: "italic",
          },

          {
               path: "../font/whitneylight.otf",
               weight: "300",
               style: "normal",
          },
          {
               path: "../font/whitneymedium.otf",
               weight: "500",
               style: "normal",
          },
          {
               path: "../font/WhitneySemiboldItalic.otf",
               weight: "600",
               style: "italic",
          },
          {
               path: "../font/whitneysemibold.otf",
               weight: "600",
               style: "normal",
          },
          {
               path: "../font/whitneymediumitalic.otf",
               weight: "500",
               style: "italic",
          },
          {
               path: "../font/whitneylightitalic.otf",
               weight: "200",
               style: "italic",
          },
     ],
     variable: "--font-whitney",
});
export const ginto = localFont({
     src: [
          {
               path: "../font/GintoThin.otf",
               weight: "200",
          },
          {
               path: "../font/GintoThinItalic.otf",
               weight: "200",
               style: "italic",
          },
          {
               path: "../font/GintoBlack.otf",
               weight: "900",
          },
          {
               path: "../font/GintoBlackItalic.otf",
               weight: "900",
               style: "italic",
          },
          {
               path: "../font/GintoBold.otf",
               weight: "700",
          },
          {
               path: "../font/GintoBoldItalic.otf",
               weight: "700",
               style: "italic",
          },
          {
               path: "../font/GintoLight.otf",
               weight: "300",
          },
          {
               path: "../font/GintoLightItalic.otf",
               weight: "300",
               style: "italic",
          },
          {
               path: "../font/GintoMedium.otf",
               weight: "500",
          },
          {
               path: "../font/GintoMediumItalic.otf",
               weight: "500",
               style: "italic",
          },
          {
               path: "../font/GintoRegular.otf",
               weight: "400",
          },
          {
               path: "../font/GintoRegularItalic.otf",
               weight: "400",
               style: "italic",
          },
     ],
     variable: "--font-ginto",
});

export default function RootLayout({
     children,
     ...props
}: {
     children: React.ReactNode;
     props: any;
}) {
     return (
          <html lang="en">
               <body
                    className={`bg-gray-700  ${whitney.variable} ${ginto.variable} font-sans`}
               >
                    <SupabaseProvider>
                         <FriendsProvider>
                              <Providers {...props}>
                                   <Nav />
                                   <div className="z-10 px-6 m-auto">
                                        {children}
                                   </div>
                              </Providers>
                         </FriendsProvider>
                    </SupabaseProvider>
               </body>
          </html>
     );
}
