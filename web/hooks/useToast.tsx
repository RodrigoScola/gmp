"use client";
import { ChildrenType, newToastType } from "@/types";
import { UseToastOptions, useToast } from "@chakra-ui/react";
import { createContext, useContext } from "react";
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
          const options = Object.assign<
               UseToastOptions,
               newToastType | undefined
          >(
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
<<<<<<< HEAD
     const { addNotification } = useNotification();

     return {
          addNotification,
     };
=======
     const toast = useNotification();

     return toast;
>>>>>>> 8e02ec11482aa4e4c7e27cd19ffd90ea7c3d049a
};
