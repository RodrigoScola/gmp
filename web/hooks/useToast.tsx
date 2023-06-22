"use client";
import { ChildrenType, newToastType } from "@/types";
import { UseToastOptions, useToast } from "@chakra-ui/react";
import { createContext, useContext } from "react";
type NotificationContextType = {
     addNotification: (message: string, options?: newToastType) => void;
     removeNotification: (message: string) => void;
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
          const options = Object.assign<
               UseToastOptions,
               newToastType | undefined
          >({ id: message, duration: 3000, title: message }, newOptions ?? {});
          if (!toast.isActive(message)) {
               toast(options);
          }
     };
     const removeNotification = (message: string) => {
          toast.close(message);
     };

     return (
          <NotificationContext.Provider
               value={{
                    addNotification: addNotification,
                    removeNotification,
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

     return toast;
};
