import { getBadges, getFriendsGames } from "./data/baseFriends";
import { ExtendedUser, IUser } from "./types/types";

export const baseUrl = "http://localhost:3000/";

export const conversationId = "thisisaconversation";

export const baseUser: IUser<ExtendedUser> = {
  id: "a5daa2be-77f4-4ba0-b5e3-717cabf20ab5",
  name: "Snuffy",
  avatar: "",
  created: new Date().toISOString(),
  email: "rodrigo.sgarabotto.scola@gmail.com",
  username: "Snuffy",
  verified: true,
  updated: new Date().toISOString(),
  // expand: {
  //   badges: getBadges(3),
  //   games: getFriendsGames(100),
  // },
};
