import { useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { DrawerContext } from "@/hooks/useDrawer";
import { DrawerBody, Drawer as D, DrawerOverlay, DrawerContent, DrawerHeader, DrawerCloseButton, DrawerFooter, Button, } from "@chakra-ui/react";
export const Drawer = ({ direction = "left", ...props }) => {
    const ref = useRef(null);
    const [now, _] = useState(Date.now().toString());
    const findParent = (currentElement, delimiter) => {
        if (!currentElement) {
            return false;
        }
        console.log(currentElement.parentElement);
        if (currentElement.className.includes(delimiter)) {
            return true;
        }
        return findParent(currentElement.parentElement, delimiter);
    };
    const handleClose = (e) => {
        if (e.target) {
            if (!findParent(e.target, `menu_${now}`)) {
                props.onClose();
            }
        }
    };
    useOnClickOutside(ref, handleClose);
    return (<DrawerContext.Provider value={{
            isOpen: props.isOpen,
            openMenu: props.onOpen,
            closeMenu: props.onClose,
        }}>
      <div onClick={props.onOpen}>{props.TriggerElement}</div>

      <D isOpen={props.isOpen} onClose={props.onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Create your account</DrawerHeader>

          <DrawerBody>{props.children}</DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={props.onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </D>
    </DrawerContext.Provider>);
};
