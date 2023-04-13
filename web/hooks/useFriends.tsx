"use client"
import { ChildrenType, Friend } from "@/types"
import { createContext, useContext, useEffect, useMemo } from "react"
import { useMap } from "usehooks-ts"

export type FriendsContext = {
	friends: Friend[]
	addFriend: (friend: Friend) => void
	getFriend: (id: string) => Friend | undefined
	updateFriend: (id: string, friend: Friend) => void
	removeFriend: (id: string) => void
}

export const FriendsContext = createContext<FriendsContext | null>(null)

export const FriendsProvider = ({ children, baseFriends }: { children: ChildrenType; baseFriends: Friend[] }) => {
	const [friendsMap, actions] = useMap<string, Friend>()

	const friends = useMemo(() => {
		return Array.from(friendsMap, (f) => f[1])
	}, [friendsMap.values()])

	const addFriend = (friend: Friend) => {
		if (friendsMap.has(friend.id)) {
			return
		}
		actions.set(friend.id, friend)
	}
	const getFriend = (id: string) => {
		return friendsMap.get(id)
	}
	const updateFriend = (id: string, friend: Friend) => {
		actions.set(id, friend)
	}
	const removeFriend = (id: string) => {
		actions.remove(id)
	}
	useEffect(() => {
		if (baseFriends.length > 0) {
			baseFriends.forEach((friend) => {
				addFriend(friend)
			})
		}
		return () => {}
	}, [])
	return (
		<FriendsContext.Provider
			value={{
				friends,
				addFriend,
				getFriend,
				updateFriend,
				removeFriend,
			}}
		>
			{children}
		</FriendsContext.Provider>
	)
}

export const useFriends = (initialState: Friend[]) => {
	const friendContext = useContext(FriendsContext)
	useEffect(() => {
		initialState.forEach((friend) => {
			friendContext?.addFriend(friend)
		})
		return () => {}
	}, [initialState])
	return friendContext
}
