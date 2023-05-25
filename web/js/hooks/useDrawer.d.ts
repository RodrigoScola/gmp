/// <reference types="react" />
export type DrawerContextType = {
    closeMenu: () => void;
    openMenu: () => void;
    isOpen: boolean;
};
export declare const DrawerContext: import("react").Context<DrawerContextType | null>;
export declare const useDrawer: () => DrawerContextType;
//# sourceMappingURL=useDrawer.d.ts.map