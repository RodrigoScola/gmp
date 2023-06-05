"use client";
import { useSupabase } from "@/app/supabase-provider";
import { db } from "@/db/supabase";
import { userSocket } from "@/lib/socket";
import { ChildrenType } from "@/types";
import {
     createContext,
     useCallback,
     useContext,
     useEffect,
     useState,
} from "react";
import { Socket } from "socket.io-client";
import {
     ChatClientEvents,
     ChatServerEvents,
} from "../../shared/src/types/socketEvents";
import { IFriend, IUser } from "../../shared/src/types/users";
import { useFriends } from "./useFriends";
import { useNotification } from "./useToast";
interface UserContext {
     user: IUser | null;
     getFriends: () => Promise<IFriend[] | undefined>;
     login: (email: string, password: string) => Promise<any>;
     logout: () => Promise<void>;
     updateUser: (user: IUser) => void;
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
               : null
     );
     const [friends, setFriends] = useState<IFriend[]>([]);
     const friendHandler = useFriends();
     const { supabase, session } = useSupabase();

     const toast = useNotification();

     const handleFetch = async () => {
          if (session && !currentUser) {
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
     }, [session]);

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
     const logout = useCallback(async () => {
          await db.auth.signOut();
          localStorage?.removeItem("user");
          console.log(localStorage?.getItem("user"));
     }, []);
     return (
          <UserContext.Provider
               value={{
                    user: currentUser,

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
