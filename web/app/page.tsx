"use client"
import { Drawer } from "@/Components/Drawer/Drawer"
import { DrawerFooter } from "@/Components/Drawer/DrawerFooter"
import { DrawerHeader } from "@/Components/Drawer/DrawerHeader"
import { FriendsList } from "@/Components/FriendsList"
import { friendsData } from "@/data/baseFriends"
import { useDisclosure } from "@/hooks/useDisclosure"

export default function Home() {
	const { isOpen, onToggle, onClose } = useDisclosure()
	return (
		<div>
			<Drawer onClose={onClose} isOpen={isOpen} onOpen={onToggle} TriggerElement={<button>---</button>}>
				<DrawerHeader className="flex">
					<h3>Friends</h3>
					<button>Add New</button>
				</DrawerHeader>
				<FriendsList friends={friendsData} />
				<DrawerFooter>
					<button onClick={onClose}>Cancel</button>
				</DrawerFooter>
			</Drawer>
		</div>
	)
}
