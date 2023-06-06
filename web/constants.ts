import { ExtendedUser } from "../shared/src/types/users";

import localFont from "@next/font/dist/local";

export const baseUrl =
     process.env.NODE_ENV == "development"
          ? "http://localhost:3000"
          : "https://gmp-eta.vercel.app";

export const conversationId = "thisisaconversation";

export const serverURl =
     process.env.NODE_ENV == "development"
          ? "http://localhost:3001"
          : "https://gmp-server.onrender.com";

export const socketUrl =
     process.env.NODE_ENV == "development"
          ? "ws://localhost:3001"
          : "wss://gmp-server.onrender.com";

export const baseUser: ExtendedUser = {
     id: "a5daa2be-77f4-4ba0-b5e3-717cabf20ab5",
     created_at: new Date().toISOString(),
     email: "rodrigo.sgarabotto.scola@gmail.com",
     username: "Snuffy",
     // expand: {
     //   badges: getBadges(3),
     //   games: getFriendsGames(100),
     // },
};
export const poppins = localFont({
     src: [
          {
               path: "../font/poppins.ttf",
               weight: "400",
          },
     ],
     variable: "--font-poppins",
});

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
               path: "../font/whitneysemibolditalic.otf",
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
          },
          {
               path: "../font/GintoBlack.otf",
               weight: "900",
          },
          {
               path: "../font/GintoBlackItalic.otf",
               weight: "900",
          },
          {
               path: "../font/GintoBold.otf",
               weight: "700",
          },
          {
               path: "../font/GintoBoldItalic.otf",
               weight: "700",
          },
          {
               path: "../font/GintoLight.otf",
               weight: "300",
          },
          {
               path: "../font/GintoLightItalic.otf",
               weight: "300",
          },
          {
               path: "../font/GintoMedium.otf",
               weight: "500",
          },
          {
               path: "../font/GintoMediumItalic.otf",
               weight: "500",
          },
          {
               path: "../font/GintoRegular.otf",
               weight: "400",
          },
          {
               path: "../font/GintoRegularItalic.otf",
               weight: "400",
          },
     ],
     variable: "--font-ginto",
});
