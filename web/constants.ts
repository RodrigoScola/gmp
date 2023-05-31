import { ExtendedUser } from "../shared/src/types/users";

export const baseUrl =
     process.env.NODE_ENV == "development"
          ? "http://localhost:3000/"
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
