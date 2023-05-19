"use client";
import { db } from "@/db/pocketbase";
import { userSocket } from "@/lib/socket";
import {
  ChatClientEvents,
  ChatServerEvents,
  ChildrenType,
  ExtendedUser,
  IUser,
} from "@/types";
import { useNotification } from "./useToast";
import { createContext, useCallback, useContext, useState } from "react";
import { useEffectOnce, useUpdateEffect } from "usehooks-ts";
import { GameInviteComponent } from "@/Components/Notifications/GameInvite";
import { Socket } from "socket.io-client";
import { useSupabase } from "@/app/supabase-provider";
interface UserContext {
  user: IUser<ExtendedUser>;
  setCurrentUser: (user: IUser) => void;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  socket: Socket<ChatClientEvents, ChatServerEvents>;
}
export const UserContext = createContext<UserContext | null>(null);

export const UserProvider = ({ children }: { children: ChildrenType }) => {
  // const [token, setTOken] = useState(db.authStore.token);
  const [currentUser, setCurrentUser] = useState<IUser<ExtendedUser> | null>(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
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
  useEffectOnce(() => {
    handleFetch();
  });

  useEffectOnce(() => {
    userSocket.auth = {
      user: currentUser,
    };
    userSocket.connect();
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
    }
    return data;
  }, []);
  const logout = useCallback(() => {
    db.auth.signOut();
  }, []);
  return (
    <UserContext.Provider
      value={{
        user: currentUser,
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
