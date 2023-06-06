import { db } from "../db";
import { IFriend, UserState } from "../types/users";
import { uhandler } from "./usersHandler";

export type FriendRequestStatus = "pending" | "accepted" | "rejected";

export type FriendRequest = {
     status: FriendRequestStatus;
     id: number;
     users: string[];
};

export class FriendHandler {
     userId: string;
     private _friends: Map<string, IFriend>;
     constructor(userId: string) {
          this._friends = new Map();
          this.userId = userId;
     }
     get friends(): IFriend[] {
          if (this._friends.size) return Array.from(this._friends.values());

          return [];
     }

     async getFriends(userId: string = this.userId): Promise<IFriend[]> {
          const { error, data } = await db.rpc("get_friends", {
               userid: userId,
          });
          if (error) return [];
          let { data: friendsProfile } = await db
               .from("profiles")
               .select("*")
               .in("id", data);
          friendsProfile = friendsProfile as IFriend[];

          friendsProfile?.forEach((friend) => {
               let f = friend as IFriend;
               f.status =
                    uhandler.getUser(friend.id)?.currentState ??
                    UserState.offline;
               if (
                    f.status !== UserState.offline &&
                    f.status !== UserState.online
               ) {
                    f.status = UserState.online;
               }

               this._friends.set(friend.id, friend as IFriend);
          });

          return friendsProfile as IFriend[];
     }
     async getRequest(
          userId: string,
          userId2: string = this.userId
     ): Promise<FriendRequest | undefined> {
          let { error, data } = await db
               .rpc("find_matching_rows", {
                    user1_id: userId2,
                    user2_id: userId,
               })
               .single();
          if (error || !data) return;
          return {
               id: data.id,
               status: data.status as FriendRequestStatus,
               users: [this.userId, userId],
          };
     }
     async addFriendRequest(userId: string) {
          const { data } = await db
               .from("connections")
               .insert({
                    friend1: this.userId,
                    friend2: userId,
                    status: "pending",
               })
               .select()
               .single();
          return data;
     }
     async isFriend(userId: string): Promise<boolean> {
          const d = await db
               .rpc("find_matching_rows", {
                    user1_id: this.userId,
                    user2_id: userId,
               })
               .single();

          if (d.error) return false;

          return true;
     }
}
