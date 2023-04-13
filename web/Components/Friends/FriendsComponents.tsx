"use client"
import { Friend } from "@/types"
import { ComponentProps } from "react"
import { Popover } from "@headlessui/react"
import Image from "next/image"
import Link from "next/link"
import Profile from "@/images/profile.webp"
import { useFriends } from "@/hooks/useFriends"
import { useDrawer } from "@/hooks/useDrawer"
export interface FriendsListProps {
	friends?: Friend[]
}
export interface FriendCardProps {
	friend: Friend
}
const FriendCardOpen = ({ friend, ...props }: ComponentProps<"div"> & FriendCardProps) => {
	const drawer = useDrawer()
	return (
		<div {...props} className="absolute bg-blue-200 ">
			<div>
				<Image src={Profile.src} alt={`profile image for ${friend.username}`} width={75} height={75} />
				<Link onClick={drawer.closeMenu} href={`/user/${friend.username}`}>
					{friend.username}
				</Link>
				<div className="flex">
					{friend.expand?.badges?.badges?.map((badge) => {
						return <div key={friend?.id + "_" + badge?.id}>{badge?.name}</div>
					})}
				</div>
			</div>

			<div>Friends Since 1 - Feb - 2023</div>

			<div>
				<h3>Stats</h3>
				<div className="grid grid-cols-2">
					{Object.values(friend?.expand?.games ?? []).map((game) => {
						return (
							<div key={game.id}>
								<p>{game.name}</p>
								<p>Wins {game.won}</p>
								<p>Losses {game.lost}</p>
							</div>
						)
					})}
				</div>
			</div>
			<div>
				<p>Note: </p>
				<p>{friend.expand?.note}</p>
			</div>
			<div>
				<input placeholder={`message @${friend.username}`} />
			</div>
		</div>
	)
}

export const FriendCard = (props: ComponentProps<"div"> & FriendCardProps) => {
	return (
		<>
			<Popover className="relative">
				<Popover.Button>{props.friend.username}</Popover.Button>

				<Popover.Panel className="relative bg-green-500 left-20 z-10">
					<FriendCardOpen friend={props.friend} />
				</Popover.Panel>
			</Popover>
		</>
	)
}

export const FriendsList = ({ friends }: FriendsListProps) => {
	const currentFriends = useFriends(friends ?? [])

	return (
		<div className="space-y-3">
			{/* <FriendCardOpen friend={friends[0]} /> */}
			{currentFriends?.friends?.map((friend) => {
				return <FriendCard key={friend.id} friend={friend} />
			})}
		</div>
	)
}
