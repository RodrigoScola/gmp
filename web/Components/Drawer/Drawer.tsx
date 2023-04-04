import { useRef } from "react"
import { MenuProps } from "../Menu/Menu"
import { useOnClickOutside } from "usehooks-ts"

interface DrawerProps extends MenuProps {}
export const Drawer = (props: DrawerProps) => {
	const ref = useRef(null)
	useOnClickOutside(ref, props.onClose)
	return (
		<>
			<div onClick={props.onOpen}>{props.TriggerElement}</div>

			{props.isOpen && (
				<div className="menu_background">
					<div ref={ref} className="bg-white pl-2 rounded-md">
						{props.children}
					</div>
				</div>
			)}
		</>
	)
}
