import { ExtendedUser } from "../shared/src/types/users";

export const baseUrl = "http://localhost:3000/";

export const conversationId = "thisisaconversation";

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
