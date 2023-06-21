"use client";
import { useSupabase } from "@/app/supabase-provider";
import { db } from "@/db/supabase";
import { userSocket, usersSocket } from "@/lib/socket";
import { createContext, useCallback, useContext, useEffect, useState, } from "react";
export const UserContext = createContext(null);
export const UserProvider = ({ children }) => {
    const [localStorage] = useState(typeof window !== "undefined" ? window.localStorage : null);
    const [currentUser, setCurrentUser] = useState(localStorage && localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user") ?? "")
        : {
            created_at: Date.now().toString(),
            email: "",
            id: "",
            username: "",
        });
    const [friends, setFriends] = useState([]);
    const { supabase, session } = useSupabase();
    const handleFetch = async () => {
        if (session && !currentUser) {
            const data = await supabase
                .from("profiles")
                .select("*")
                .eq("id", session?.user.id)
                .single();
            if (data.data) {
                localStorage?.setItem("user", JSON.stringify(data.data));
                setCurrentUser(data.data);
            }
        }
    };
    useEffect(() => {
        handleFetch();
    }, [session]);
    const getFriends = async () => {
        if (!currentUser)
            return;
        usersSocket.emit("get_friends", currentUser.id, async (friends) => {
            setFriends(friends);
        });
        return friends;
    };
    const updateUser = (user) => {
        setCurrentUser(user);
        localStorage?.setItem("user", JSON.stringify(user));
    };
    const login = useCallback(async (email, password) => {
        const { data } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (!data.user)
            return;
        if (typeof data.user.id == undefined)
            return;
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
    const [isLoggedIn, setLoggedIn] = useState(null);
    useEffect(() => {
        if (currentUser) {
            setLoggedIn(true);
        }
        else {
            setLoggedIn(false);
        }
    }, [currentUser]);
    return (<UserContext.Provider value={{
            user: currentUser,
            isLoggedIn,
            updateUser,
            getFriends,
            login,
            socket: userSocket,
            logout,
            friends,
        }}>
               {children}
          </UserContext.Provider>);
};
export const useUser = () => {
    const userContext = useContext(UserContext);
    if (userContext) {
        return userContext;
    }
    throw new Error("useUser must be used within a UserProvider");
};
