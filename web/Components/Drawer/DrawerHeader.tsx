import { ComponentProps } from "react"

export const DrawerHeader = ({ children, ...props }: ComponentProps<"div">) => {
	return <div {...props}>{children}</div>
}
