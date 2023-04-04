import { useState, useCallback } from "react"
export const useDisclosure = () => {
	const [isOpen, setIsOpen] = useState(false)
	const onClose = useCallback(() => {
		setIsOpen(false)
	}, [setIsOpen])
	const onOpen = useCallback(() => {
		setIsOpen(true)
	}, [setIsOpen])
	const onToggle = useCallback(() => {
		setIsOpen((curr) => !curr)
	}, [setIsOpen])
	return { isOpen, onClose, onOpen, onToggle }
}
