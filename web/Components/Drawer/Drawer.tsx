import { useRef } from "react"
import { MenuProps } from "../Menu/Menu"
import { useOnClickOutside } from "usehooks-ts"
import { Direction } from "@/types"
import { DrawerContext } from "@/hooks/useDrawer"

interface DrawerProps extends MenuProps {
	direction?: Direction
}
export const Drawer = ({ direction = "left", ...props }: DrawerProps) => {
	const ref = useRef(null)

	useOnClickOutside(ref, props.onClose)
	return (
		<DrawerContext.Provider
			value={{
				isOpen: props.isOpen,
				openMenu: props.onOpen,
				closeMenu: props.onClose,
			}}
		>
			<div onClick={props.onOpen}>{props.TriggerElement}</div>

			{props.isOpen && (
				<div className={`menu_background`}>
					<div ref={ref} className="bg-white pl-2 rounded-md">
						{props.children}
					</div>
				</div>
			)}
		</DrawerContext.Provider>
	)
}
