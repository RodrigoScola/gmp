"use client";
import { db } from "@/db/supabase";
import { userSocket } from "@/lib/socket";
import { ChildrenType } from "@/types";
import { useNotification } from "./useToast";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useEffectOnce } from "usehooks-ts";
import { GameInviteComponent } from "@/Components/Notifications/GameInvite";
import { Socket } from "socket.io-client";
import { useSupabase } from "@/app/supabase-provider";
import { IUser, IFriend, GameInvite } from "../../shared/src/types/users";
import {
  ChatClientEvents,
  ChatServerEvents,
} from "../../shared/src/types/socketEvents";
import { AddFiendComponent } from "@/Components/Notifications/AddFriend";
import { useFriends } from "./useFriends";
interface UserContext {
  user: IUser;
  setCurrentUser: (user: IUser) => void;
  getFriends: () => Promise<IFriend[] | undefined>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  socket: Socket<ChatClientEvents, ChatServerEvents>;
  friends: IFriend[];
}
export const UserContext = createContext<UserContext | null>(null);

export const UserProvider = ({ children }: { children: ChildrenType }) => {
  // const [token, setTOken] = useState(db.authStore.token);
  const [localStorage] = useState(
    typeof window !== "undefined" ? window.localStorage : null
  );
  const [currentUser, setCurrentUser] = useState<IUser | null>(
    localStorage && localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user") ?? "")
      : { id: null }
  );
  const [friends, setFriends] = useState<IFriend[]>([]);
  const friendHandler = useFriends();
  const { supabase, session } = useSupabase();

  const toast = useNotification();

  const handleFetch = async () => {
    if (currentUser) return;
    const localUser = localStorage?.getItem("user");
    if (localUser) {
      setCurrentUser(JSON.parse(localUser));
    } else {
      const data = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user.id)
        .single();

      localStorage?.setItem("user", JSON.stringify(data.data));
      setCurrentUser(data.data);
    }
  };
  useEffect(() => {
    handleFetch();
  }, []);
  console.log(currentUser);
  useEffectOnce(() => {
    userSocket.auth = {
      user: currentUser,
    };
    userSocket.connect();
    userSocket.on("add_friend_response", (data) => {
      toast.addNotification("Game Request", {
        duration: 15000,
        render: () => <AddFiendComponent friend={data} />,
      });
    });
    userSocket.on("notification_message", (data) => {
      toast.addNotification(`${data.user.username} sent you a message`);
    });
    userSocket.on("game_invite", (data: GameInvite) => {
      toast.addNotification("Game Request", {
        duration: 15000,
        render: () => <GameInviteComponent gameInvite={data} />,
      });
    });
    userSocket.on("game_invite_accepted", (data) => {
      window.location.href = `/play/${data.roomId}`;
    });
    return () => {
      if (userSocket) {
        userSocket.disconnect();
      }
    };
  });
  const getFriends = async () => {
    if (!currentUser) return;
    const friendss = await friendHandler?.getFriends(currentUser.id);
    if (friendss) {
      setFriends(friendss);
    }
    return friendss;
  };

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (data?.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();
      if (profile) {
        setCurrentUser(profile);
        localStorage?.setItem("user", JSON.stringify(profile));
      }
    }
    return data;
  }, []);
  const logout = useCallback(() => {
    db.auth.signOut();
  }, []);
  return (
    <UserContext.Provider
      value={{
        user: currentUser ?? {
          created_at: "",
          email: "",
          id: "",
          username: "",
        },
        setCurrentUser,
        getFriends,
        login,
        socket: userSocket,
        logout,
        friends,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const userContext = useContext(UserContext);
  if (userContext) {
    return userContext;
  }
  throw new Error("useUser must be used within a UserProvider");
};
