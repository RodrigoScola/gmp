import { useState, useCallback } from "react";
export const useDisclosure = (props) => {
    const [isOpen, setIsOpen] = useState(props?.defaultState ?? false);
    const onClose = useCallback(() => {
        setIsOpen(false);
    }, [setIsOpen]);
    const onOpen = useCallback(() => {
        setIsOpen(true);
    }, [setIsOpen]);
    const onToggle = useCallback(() => {
        setIsOpen((curr) => !curr);
    }, [setIsOpen]);
    return { isOpen, onClose, onOpen, onToggle };
};
