"use client";
import { createContext, useContext } from "react";
import { useToast } from "@chakra-ui/react";
export const NotificationContext = createContext(null);
export const NotificationProvider = ({ children, }) => {
    const toast = useToast();
    const addNotification = (message, newOptions) => {
        const options = Object.assign({
            duration: 3000,
            title: message,
        }, newOptions ?? {});
        toast(options);
    };
    return (<NotificationContext.Provider value={{
            addNotification: addNotification,
        }}>
      {children}
    </NotificationContext.Provider>);
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
