import React, { ComponentProps } from "react";
export type MenuProps = {
    title?: string;
    TriggerElement: React.ReactNode;
    children?: React.ReactNode | React.ReactNode[];
    isOpen: boolean;
    onClose: () => void;
    onOpen: () => void;
    onToggle?: () => void;
};
export declare const Menu: (props: ComponentProps<"div"> & MenuProps) => JSX.Element;
//# sourceMappingURL=Menu.d.ts.map