"use client";
import { pb } from "@/db/pocketbase";
import { userSocket } from "@/lib/socket";
import { UsersRecord, UsersResponse } from "@/pocketbase-types";
import {
  ChatClientEvents,
  ChatServerEvents,
  ChildrenType,
  ExtendedUser,
  User,
} from "@/types";
import { useNotification } from "./useToast";
import { Admin, RecordAuthResponse } from "pocketbase";
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

interface UserContext {
  user: User<ExtendedUser>;
  setCurrentUser: (user: User) => void;
  login: (
    email: string,
    password: string
  ) => Promise<RecordAuthResponse<UsersRecord>>;
  logout: () => void;
  socket: Socket<ChatClientEvents, ChatServerEvents>;
}
export const UserContext = createContext<UserContext | null>(null);

export const UserProvider = ({ children }: { children: ChildrenType }) => {
  const [token, setTOken] = useState(pb.authStore.token);
  const [currentUser, setCurrentUser] = useState<User<ExtendedUser>>(
    pb.authStore.model as User<ExtendedUser>
  );
  const toast = useNotification();
  useUpdateEffect(() => {
    return pb.authStore.onChange((token, model) => {
      setCurrentUser(model);
      setTOken(token);
    });
  }, [pb.authStore]);

  useEffectOnce(() => {
    userSocket.auth = {
      user: currentUser,
    };
    userSocket.connect();

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
    return await pb.collection("users").authWithPassword(email, password);
  }, []);
  const logout = useCallback(() => {
    pb.authStore.clear();
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
