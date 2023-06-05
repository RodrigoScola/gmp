"use client";
import { userSocket } from "@/lib/socket";
import { useEffect } from "react";
import { useUser } from "./useUser";

export const useUserSocket = () => {
     const { user } = useUser();
     useEffect(() => {
          if (!user) return;
          userSocket.emit("update_user", {
               ...user,
               socketId: userSocket.id,
          });
     }, []);
};
