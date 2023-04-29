"use client";
import { ChildrenType, ToastType, newToastType } from "@/types";
import { createContext, useContext } from "react";
import toast, { Toaster } from "react-hot-toast";

type ToastContextType = {
  addToast: (message: string, options: newToastType | null) => void;
};

export const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider = ({ children }: { children: ChildrenType }) => {
  const addToast = (message: string, newOptions: newToastType | null) => {
    const options = Object.assign<ToastType, newToastType | undefined>(
      {
        duration: 3000,
        className: "bg-gray-800 text-white",
        message,
        style: {
          "z-index": "99",
        },
        position: "top-center",
      },
      newOptions ?? {}
    );

    toast(message, options);
  };

  return (
    <ToastContext.Provider
      value={{
        addToast,
      }}
    >
      {children}
      <Toaster />
    </ToastContext.Provider>
  );
};
export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
