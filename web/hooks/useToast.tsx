"use client";
import { ChildrenType, ToastType, newToastType } from "@/types/types";
import { createContext, useContext, useEffect } from "react";
import { UseToastOptions, useToast } from "@chakra-ui/react";
import { useUser } from "./useUser";
import { useEffectOnce } from "usehooks-ts";
import { userSocket } from "@/lib/socket";
type NotificationContextType = {
  addNotification: (message: string, options?: newToastType) => void;
};

export const NotificationContext =
  createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({
  children,
}: {
  children: ChildrenType;
}) => {
  const toast = useToast();
  const addNotification = (message: string, newOptions?: newToastType) => {
    const options = Object.assign<UseToastOptions, newToastType | undefined>(
      {
        duration: 3000,
        title: message,
      },
      newOptions ?? {}
    );
    toast(options);
  };

  return (
    <NotificationContext.Provider
      value={{
        addNotification: addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const useNotifications = () => {
  const toast = useNotification();

  return {};
};
