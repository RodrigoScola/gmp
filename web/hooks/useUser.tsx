"use client";
import { db } from "@/db/supabase";
import { chatSocket, userSocket } from "@/lib/socket";
import { ChildrenType } from "@/types";
import {
     createContext,
     useCallback,
     useContext,
     useEffect,
     useState,
} from "react";
import { useNotification } from "./useToast";

import { AddFiendComponent } from "@/Components/Notifications/AddFriend";
import { GameInviteComponent } from "@/Components/Notifications/GameInvite";
import { useSupabase } from "@/app/supabase-provider";
import { Socket } from "socket.io-client";
import { useUpdateEffect } from "usehooks-ts";
import {
     ChatClientEvents,
     ChatServerEvents,
} from "../../shared/src/types/socketEvents";
import { GameInvite, IFriend, IUser } from "../../shared/src/types/users";
import { useFriends } from "./useFriends";
interface UserContext {
     user: IUser | null;
     getFriends: () => Promise<IFriend[] | undefined>;
     login: (email: string, password: string) => Promise<any>;
     logout: () => Promise<void>;
     updateUser: (user: IUser) => void;
     socket: Socket<ChatClientEvents, ChatServerEvents>;
     friends: IFriend[];
     isLoggedIn: boolean | null;
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
               : null
     );
     const [friends, setFriends] = useState<IFriend[]>([]);
     const friendHandler = useFriends();
     const { supabase, session } = useSupabase();

     const toast = useNotification();

     const handleFetch = async () => {
          if (session && !currentUser) {
               if (session.user.id) {
                    const data = await supabase
                         .from("profiles")
                         .select("*")
                         .eq("id", session?.user.id)
                         .single();
                    localStorage?.setItem("user", JSON.stringify(data.data));
                    setCurrentUser(data.data);
               }
          }
     };
     useEffect(() => {
          handleFetch();
     }, [session]);
     useEffect(() => {
          if (userSocket.connected) return;
          userSocket.auth = {
               user: currentUser,
          };
          if (!chatSocket.connected) {
               chatSocket.auth = {
                    user: currentUser,
               };
               chatSocket.connect();
          }
          userSocket.connect();
          console.log(userSocket.connected);
          userSocket.on("add_friend_response", (data) => {
               console.log(data);
               toast.addNotification("Game Request", {
                    duration: 15000,
                    render: () => <AddFiendComponent friend={data} />,
               });
          });
          userSocket.on("notification_message", (data) => {
               toast.addNotification(
                    `${data.user.username} sent you a message`
               );
          });
          userSocket.on("game_invite", (data: GameInvite) => {
               console.log(data);
               toast.addNotification("Game Request", {
                    duration: 15000,
                    render: () => <GameInviteComponent gameInvite={data} />,
               });
          });
          userSocket.on("game_invite_accepted", (data) => {
               window.location.href = `/play/${data.roomId}`;
          });
          return () => {
               if (chatSocket.connected) {
                    chatSocket.disconnect();
               }
               if (userSocket.connected) {
                    userSocket.disconnect();
               }
          };
     }, [currentUser, userSocket.connected]);
     const getFriends = async () => {
          if (!currentUser) return;
          const friendss = await friendHandler?.getFriends(currentUser.id);
          if (friendss) {
               setFriends(friendss);
          }
          return friendss;
     };

     const updateUser = (user: IUser) => {
          setCurrentUser(user);
          localStorage?.setItem("user", JSON.stringify(user));
     };

     const login = useCallback(async (email: string, password: string) => {
          const { data } = await supabase.auth.signInWithPassword({
               email,
               password,
          });
          if (!data.user) return;
          const { data: profile } = await supabase
               .from("profiles")
               .select("*")
               .eq("id", data.user.id)
               .single();
          if (profile) {
               setCurrentUser(profile);
               localStorage?.setItem("user", JSON.stringify(profile));
          }
          return data;
     }, []);
     const logout = useCallback(async () => {
          await db.auth.signOut();
          await supabase.auth.signOut();
          localStorage?.removeItem("user");
     }, []);
     const [isLoggedIn, setLoggedIn] = useState<boolean | null>(null);
     useUpdateEffect(() => {
          if (currentUser) {
               setLoggedIn(true);
          } else {
               setLoggedIn(false);
          }
     }, [currentUser]);
     return (
          <UserContext.Provider
               value={{
                    user: currentUser,
                    isLoggedIn,
                    updateUser,
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
