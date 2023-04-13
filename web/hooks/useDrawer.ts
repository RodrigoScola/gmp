import { createContext, useContext } from "react"
// the provider is on Drawer.tsx

export type DrawerContextType = {
	closeMenu: () => void
	openMenu: () => void
	isOpen: boolean
}

export const DrawerContext = createContext<DrawerContextType | null>(null)

export const useDrawer = () => {
	const ctx = useContext(DrawerContext)

	if (!ctx) {
		throw new Error("useDrawer must be used within a Drawer")
	}
	return ctx
}
