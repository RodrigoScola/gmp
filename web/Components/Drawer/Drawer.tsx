import { useRef, useState } from "react";
import { MenuProps } from "../Menu/Menu";
import { useOnClickOutside } from "usehooks-ts";
import { Direction } from "../../../shared/src/types/types";
import { DrawerContext } from "@/hooks/useDrawer";
import {
  DrawerBody,
  Drawer as D,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerCloseButton,
  DrawerFooter,
  Button,
} from "@chakra-ui/react";

interface DrawerProps extends MenuProps {
  direction?: Direction;
}
export const Drawer = ({ direction = "left", ...props }: DrawerProps) => {
  const ref = useRef<HTMLElement>(null);

  const [now, _] = useState<string>(Date.now().toString());

  const findParent = (
    currentElement: HTMLElement | null,
    delimiter: string
  ): boolean => {
    if (!currentElement) {
      return false;
    }
    console.log(currentElement.parentElement);
    if (currentElement.className.includes(delimiter)) {
      return true;
    }
    return findParent(currentElement.parentElement, delimiter);
  };
  const handleClose = (e: MouseEvent) => {
    if (e.target) {
      if (!findParent(e.target as HTMLElement, `menu_${now}`)) {
        props.onClose();
      }
    }
  };

  useOnClickOutside(ref, handleClose);
  return (
    <DrawerContext.Provider
      value={{
        isOpen: props.isOpen,
        openMenu: props.onOpen,
        closeMenu: props.onClose,
      }}
    >
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
    </DrawerContext.Provider>
  );
};
