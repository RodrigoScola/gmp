/// <reference types="react" />
export type ChildrenType = React.ReactNode | React.ReactNode[] | JSX.Element | JSX.Element[];
import { UseToastOptions } from "@chakra-ui/react";
export type ToastPositions = "top-center" | "top-left" | "top-right" | "bottom-center" | "bottom-left" | "bottom-right";
export type ToastThemeType = {
    primary: string;
    secondary: string;
};
export type ToastType = {
    message: string;
    duration: number;
    position: ToastPositions;
    style?: object;
    className?: string;
    icon?: string;
    iconTheme?: ToastThemeType;
};
export type newToastType = Partial<UseToastOptions>;
//# sourceMappingURL=types.d.ts.map