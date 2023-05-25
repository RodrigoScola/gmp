import { createContext, useContext } from "react";
export const DrawerContext = createContext(null);
export const useDrawer = () => {
    const ctx = useContext(DrawerContext);
    if (!ctx) {
        throw new Error("useDrawer must be used within a Drawer");
    }
    return ctx;
};
