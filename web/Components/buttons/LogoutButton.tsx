"use client";
import { useUser } from "@/hooks/useUser";
import { Button } from "@chakra-ui/react";
import { useCallback } from "react";

export const LogoutButton = () => {
  const user = useUser();
  if (!user) return null;
  const handleLogout = useCallback(async () => {
    await user.logout();
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  }, [user.logout]);
  return <Button onClick={handleLogout}>Logout</Button>;
};
