"use client"
import { Friend } from "@/types"

export interface FriendsListProps {
	friends: Friend[]
}
export const FriendsList = ({ friends }: FriendsListProps) => {
	return (
		<div className="">
			{friends.map((v) => {
				return <p key={v.id}>{v.username}</p>
			})}
		</div>
	)
}
