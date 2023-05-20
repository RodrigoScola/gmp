import { IUser, SocketUser } from "../../../web/types/types";
import { db } from "../lib/db";

export class FriendHandler {
  userId: string;
  friends: Map<string, IUser>;
  constructor(userId: string) {
    this.friends = new Map();
    this.userId = userId;
  }
  async friendRequest(user: string | SocketUser) {}
  async isFriend(userId: string): Promise<boolean> {
    const { error, data } = await db
      .from("connections")
      .select("id")
      .or(
        `friend1.eq. ` +
          userId +
          ",friend2.eq." +
          this.userId +
          "," +
          "friend1.eq." +
          this.userId +
          ",friend2.eq." +
          userId
      )
      .single();
    console.log(data);
    if (error) return false;

    return true;
  }
}
