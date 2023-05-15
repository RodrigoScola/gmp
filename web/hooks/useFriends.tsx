"use client";
import { ChildrenType, Friend, GameNames } from "@/types";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useMap } from "usehooks-ts";
import { useNotification } from "./useToast";
import { userSocket } from "@/lib/socket";
import { GameInviteComponent } from "@/Components/Notifications/GameInvite";

export type FriendsContext = {
  friends: Friend[];
  addFriend: (friend: Friend) => void;
  getFriend: (id: string) => Friend | undefined;
  updateFriend: (id: string, friend: Friend) => void;
  removeFriend: (id: string) => void;
};

export const FriendsContext = createContext<FriendsContext | null>(null);

export const FriendsProvider = ({
  children,
  baseFriends,
}: {
  children: ChildrenType;
  baseFriends: Friend[];
}) => {
  const [friendsMap, actions] = useMap<string, Friend>();

  const friends = useMemo(() => {
    return Array.from(friendsMap, (f) => f[1]);
  }, [friendsMap.values()]);

  const addFriend = (friend: Friend) => {
    if (friendsMap.has(friend.id)) {
      return;
    }
    actions.set(friend.id, friend);
  };
  const getFriend = (id: string) => {
    return friendsMap.get(id);
  };
  const updateFriend = (id: string, friend: Friend) => {
    actions.set(id, friend);
  };
  const removeFriend = (id: string) => {
    actions.remove(id);
  };
  useEffect(() => {
    if (baseFriends.length > 0) {
      baseFriends.forEach((friend) => {
        addFriend(friend);
      });
    }
    return () => {};
  }, []);
  return (
    <FriendsContext.Provider
      value={{
        friends,
        addFriend,
        getFriend,
        updateFriend,
        removeFriend,
      }}
    >
      {children}
    </FriendsContext.Provider>
  );
};

export const useFriends = (initialState: Friend[]) => {
  const friendContext = useContext(FriendsContext);
  useEffect(() => {
    initialState.forEach((friend) => {
      friendContext?.addFriend(friend);
    });
    return () => {};
  }, [initialState]);
  return friendContext;
};

export const useFriend = (id?: string) => {
  const [friendId, setFriendId] = useState<string>(id);

  const friendContext = useContext(FriendsContext);
  const t = useNotification();
  return {
    setFriendId,
    id: friendId,
    friend: friendContext?.getFriend(friendId),
    sendInvite: (gameName: GameNames) => {
      // const game = getGameData(gameName);
      console.log(friendId);
      // if (!game) {
      //   throw new Error("Game not found");
      // }
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
