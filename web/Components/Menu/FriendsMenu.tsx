"use client"
import { Drawer } from "@/Components/Drawer/Drawer"
import { DrawerFooter } from "@/Components/Drawer/DrawerFooter"
import { FriendsList } from "@/Components/Friends/FriendsComponents"
import { useDisclosure } from "@/hooks/useDisclosure"
import { Popover } from "@headlessui/react"

type FriendsMenuProps = {
	disclosure: Partial<ReturnType<typeof useDisclosure>>
}

export default function FriendsMenu(props: FriendsMenuProps) {
	const { isOpen, onToggle, onClose } = useDisclosure({ defaultState: false })
	const handleSubmit = (e) => {
		e.preventDefault()
	}
	const handleCloseMenu = () => {
		props.disclosure.onClose()
		onClose()
	}
	return (
		<div>
			<Drawer
				onClose={handleCloseMenu}
				isOpen={isOpen}
				onOpen={onToggle}
				TriggerElement={
					<div>
						<h3>Friends</h3>
					</div>
				}
			>
				<div className="flex">
					<Popover>
						<Popover.Button>Add New</Popover.Button>
						<Popover.Panel className={"relative border border-black"}>
							<form onSubmit={handleSubmit} className="flex flex-row">
								<label className="flex flex-col">
									Username
									<input />
								</label>
								<button>Search</button>
							</form>
						</Popover.Panel>
					</Popover>
				</div>
				<FriendsList />
				<DrawerFooter>
					<button onClick={onClose}>Cancel</button>
				</DrawerFooter>
			</Drawer>
		</div>
	)
}
