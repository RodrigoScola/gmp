"use client";
import { FriendRequestNotification } from "@/Components/FriendRequestComponent";
import { GameInviteSent } from "@/Components/Notifications/GameInviteSent";
import { userSocket, usersSocket } from "@/lib/socket";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useMap } from "usehooks-ts";
import { db } from "../../shared/src/db";
import { FriendHandler } from "../../shared/src/handlers/FriendHandler";
import { useNotification } from "./useToast";
export const FriendsContext = createContext(null);
export const FriendsProvider = ({ children }) => {
    const [friendsMap, actions] = useMap();
    const [handler, _] = useState(new FriendHandler(""));
    const friends = useMemo(() => {
        return Array.from(friendsMap, (f) => f[1]);
    }, [friendsMap.values()]);
    const addFriend = (friend) => {
        if (friendsMap.has(friend.id)) {
            return;
        }
        actions.set(friend.id, friend);
    };
    const getFriend = async (id) => {
        if (friendsMap.has(id)) {
            return friendsMap.get(id);
        }
        let data = await db
            .from("profiles")
            .select("*")
            .eq("id", id)
            .single();
        if (!data.data)
            return;
        let ndata = data.data;
        usersSocket.emit("get_user", id, (user) => {
            ndata = { ...ndata, ...user };
        });
        addFriend(ndata);
        return friendsMap.get(id);
    };
    const updateFriend = (id, friend) => {
        actions.set(id, friend);
    };
    const getFriends = async (userId) => {
        const friends = await handler.getFriends(userId);
        friends.forEach((friend) => {
            addFriend(friend);
        });
        return friends;
    };
    const removeFriend = (id) => {
        actions.remove(id);
    };
    return (<FriendsContext.Provider value={{
            friends,
            addFriend,
            getFriends,
            getFriend,
            updateFriend,
            removeFriend,
        }}>
               {children}
          </FriendsContext.Provider>);
};
export const useFriends = () => {
    const friendContext = useContext(FriendsContext);
    return friendContext;
};
export const useFriend = (id) => {
    const [friendId, setFriendId] = useState(id);
    const [friend, setFriend] = useState(null);
    const friendContext = useContext(FriendsContext);
    const t = useNotification();
    const updateFriend = (user) => {
        friendContext?.updateFriend(user.id, user);
    };
    const go = async () => {
        if (!friendId)
            return;
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
        updateFriend,
        sendFriendRequest: (userId) => {
            userSocket.emit("add_friend", userId);
            console.log(`Friend request sent to ${userId}`);
            t.addNotification("Friend request sent", {
                render: () => <FriendRequestNotification friend={friend}/>,
            });
        },
        sendInvite: (gameName) => {
            console.log(friendId);
            if (friendId)
                userSocket.emit("game_invite", gameName.toString(), friendId);
            console.log(`Invite ${friendId} to ${gameName}`);
            t.addNotification("Invite sent", {
                render: () => <GameInviteSent user={friend}/>,
            });
        },
    };
};
