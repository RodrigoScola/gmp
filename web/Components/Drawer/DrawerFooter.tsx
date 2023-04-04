import { ChildrenType } from "@/types"

export const DrawerFooter = ({ children }: { children: ChildrenType }) => {
	return <div className="absolute bottom-5 right-10">{children}</div>
}
