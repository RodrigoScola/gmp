/// <reference types="react" />
import { ChildrenType, newToastType } from "@/types";
type NotificationContextType = {
    addNotification: (message: string, options?: newToastType) => void;
};
export declare const NotificationContext: import("react").Context<NotificationContextType | null>;
export declare const NotificationProvider: ({ children, }: {
    children: ChildrenType;
}) => JSX.Element;
export declare const useNotification: () => NotificationContextType;
export declare const useNotifications: () => NotificationContextType;
export {};
//# sourceMappingURL=useToast.d.ts.map