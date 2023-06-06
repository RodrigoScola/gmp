"use client";
import { userSocket, usersSocket } from "@/lib/socket";
import { ChildrenType } from "@/types";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useMap } from "usehooks-ts";
import { db } from "../../shared/src/db";
import { FriendHandler } from "../../shared/src/handlers/FriendHandler";
import { GameNames } from "../../shared/src/types/game";
import { IFriend as Friend } from "../../shared/src/types/users";
import { useNotification } from "./useToast";

export type FriendsContext = {
     friends: Friend[];
     addFriend: (friend: Friend) => void;
     getFriends: (userId: string) => Promise<Friend[]>;
     getFriend: (id: string) => Promise<Friend | undefined>;
     updateFriend: (id: string, friend: Friend) => void;
     removeFriend: (id: string) => void;
};

export const FriendsContext = createContext<FriendsContext | null>(null);

export const FriendsProvider = ({ children }: { children: ChildrenType }) => {
     const [friendsMap, actions] = useMap<string, Friend>();
     const [handler, _] = useState<FriendHandler>(new FriendHandler(""));
     const friends = useMemo(() => {
          return Array.from(friendsMap, (f) => f[1]);
     }, [friendsMap.values()]);

     const addFriend = (friend: Friend) => {
          if (friendsMap.has(friend.id)) {
               return;
          }
          actions.set(friend.id, friend);
     };
     const getFriend = async (id: string) => {
          if (friendsMap.has(id)) {
               return friendsMap.get(id);
          }
          const data = await db
               .from("profiles")
               .select("*")
               .eq("id", id)
               .single();
          if (!data.data) return;
          addFriend(data.data);
          return friendsMap.get(id);
     };
     const updateFriend = (id: string, friend: Friend) => {
          actions.set(id, friend);
     };
     const getFriends = async (userId: string) => {
          const friends = await handler.getFriends(userId);
          friends.forEach((friend) => {
               addFriend(friend);
          });
          return friends;
     };
     const removeFriend = (id: string) => {
          actions.remove(id);
     };
     return (
          <FriendsContext.Provider
               value={{
                    friends,
                    addFriend,
                    getFriends,
                    getFriend,
                    updateFriend,
                    removeFriend,
               }}
          >
               {children}
          </FriendsContext.Provider>
     );
};

export const useFriends = () => {
     const friendContext = useContext(FriendsContext);
     return friendContext;
};

export const useFriend = (id?: string) => {
     const [friendId, setFriendId] = useState<string | null | undefined>(id);
     const [friend, setFriend] = useState<Friend | null>(null);
     const friendContext = useContext(FriendsContext);
     const t = useNotification();

     const go = async () => {
          if (!friendId) return;
          const d = await friendContext?.getFriend(friendId);
          if (d) {
               setFriend(d);
          }
     };
     useEffect(() => {
          go();
     });

     return {
          setFriendId,
          id: friendId,
          friend: friend,
          sendFriendRequest: (userId: string) => {
               userSocket.emit("add_friend", userId);
               console.log(`Friend request sent to ${userId}`);
               t.addNotification("Friend request sent");
          },
          sendInvite: (gameName: GameNames) => {
               console.log(friendId);
               if (friendId)
                    userSocket.emit(
                         "game_invite",
                         gameName.toString() as GameNames,
                         friendId
                    );
               console.log(`Invite ${friendId} to ${gameName}`);
               t.addNotification("Invite sent");
          },
     };
};
