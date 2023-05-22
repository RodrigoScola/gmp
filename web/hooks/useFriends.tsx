"use client";
import { ChildrenType, Friend, GameNames } from "@/types/types";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useMap } from "usehooks-ts";
import { useNotification } from "./useToast";
import { userSocket } from "@/lib/socket";
import { db } from "@/db/supabase";
import { FriendHandler } from "@/../server/src/handlers/FriendHandler";

export type FriendsContext = {
  friends: Friend[];
  addFriend: (friend: Friend) => void;
  getFriends: (userId: string) => Promise<Friend[]>;
  getFriend: (id: string) => Friend | undefined;
  updateFriend: (id: string, friend: Friend) => void;
  removeFriend: (id: string) => void;
};

export const FriendsContext = createContext<FriendsContext | null>(null);

export const FriendsProvider = ({ children }: { children: ChildrenType }) => {
  const [friendsMap, actions] = useMap<string, Friend>();
  const [handler, setFriendHandler] = useState<FriendHandler>(
    new FriendHandler("")
  );
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
    const data = await db.from("profiles").select("*").eq("id", id).single();

    if (data.data) {
      addFriend(data.data);
    }
    console.log(friendsMap);

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
  const [friendId, setFriendId] = useState<string>(id);
  const [friend, setFriend] = useState<Friend | null>(null);
  const friendContext = useContext(FriendsContext);
  const t = useNotification();

  const go = async () => {
    if (!friendId) return;
    const d = await friendContext?.getFriend(friendId);
    setFriend(d);
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
