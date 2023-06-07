"use client";
import { useUser } from "@/hooks/useUser";
import { useCallback } from "react";

export const LogoutButton = () => {
     const user = useUser();
     if (!user) return null;
     const handleLogout = useCallback(async () => {
          await user.logout();
          if (typeof window !== "undefined") {
               window.location.href = process.env.SITE_URL ?? "/";
          }
     }, [user.logout]);
     return (
          <button
               className="button bg-red rounded-lg font-whitney font-semibold"
               onClick={handleLogout}
          >
               Logout
          </button>
     );
};
