"use client";
import { db } from "@/db/supabase";
import { userSocket } from "@/lib/socket";
import { ChildrenType } from "@/types/types";
import { useNotification } from "./useToast";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useEffectOnce, useUpdateEffect } from "usehooks-ts";
import { GameInviteComponent } from "@/Components/Notifications/GameInvite";
import { Socket } from "socket.io-client";
import { useSupabase } from "@/app/supabase-provider";
import { IUser } from "@/types/users";
import { ChatClientEvents, ChatServerEvents } from "@/types/socketEvents";
import { AddFiendComponent } from "@/Components/Notifications/AddFriend";
interface UserContext {
  user: IUser;
  setCurrentUser: (user: IUser) => void;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  socket: Socket<ChatClientEvents, ChatServerEvents>;
}
export const UserContext = createContext<
  | UserContext
  | {
      id: null;
    }
>({
  id: null,
});

export const UserProvider = ({ children }: { children: ChildrenType }) => {
  // const [token, setTOken] = useState(db.authStore.token);
  const [currentUser, setCurrentUser] = useState<IUser | null>(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : { id: null }
  );
  const { supabase, session } = useSupabase();

  const toast = useNotification();

  const handleFetch = async () => {
    if (currentUser) return;
    const localUser = localStorage.getItem("user");
    if (localUser) {
      setCurrentUser(JSON.parse(localUser));
    } else {
      const data = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user.id)
        .single();

      localStorage.setItem("user", JSON.stringify(data.data));
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
    userSocket.on("game_invite", (data) => {
      toast.addNotification("Game Request", {
        duration: 15000,
        render: () => <GameInviteComponent gameInvite={data} />,
      });
    });
    userSocket.on("game_invite_accepted", (data) => {
      console.log(data);
      window.location.href = `/play/${data.roomId}`;
    });
    return () => {
      if (userSocket) {
        userSocket.disconnect();
      }
    };
  });

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (data?.user) {
      setCurrentUser(data.user);

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      localStorage.setItem("user", JSON.stringify(profile));
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
          id: null,
          created_at: Date.now(),
          email: "defaultemail@gmail.com",
          username: "default username",
        },
        login,
        socket: userSocket,
        logout,
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
