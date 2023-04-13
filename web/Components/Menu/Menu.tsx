"use client"

import React, { ComponentProps } from "react"

export type MenuProps = {
	title?: string
	TriggerElement: React.ReactNode
	children?: React.ReactNode | React.ReactNode[]
	isOpen: boolean
	onClose: () => void
	onOpen: () => void
	onToggle?: () => void
}

export const Menu = (props: ComponentProps<"div"> & MenuProps) => {
	const { TriggerElement, children } = props

	return (
		<>
			<button onClick={() => props.onOpen()}>{TriggerElement}</button>

			{props.isOpen && <div {...props}>{children}</div>}
		</>
	)
}
