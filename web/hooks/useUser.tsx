"use client"
import { baseUser } from "@/constants"
import { newUser } from "@/db/User"
import { ChildrenType, ExtendedUser, User } from "@/types"
import { createContext, useContext, useState } from "react"

interface UserContext extends User<ExtendedUser> {
	setCurrentUser: (user: User) => void
}
export const UserContext = createContext<UserContext | null>(null)

export const UserProvider = ({ children }: { children: ChildrenType }) => {
	const [currentUser, setCurrentUser] = useState<User<ExtendedUser>>(newUser(baseUser))

	return (
		<UserContext.Provider
			value={{
				...currentUser,
				setCurrentUser,
			}}
		>
			{children}
		</UserContext.Provider>
	)
}

export const useUser = () => {
	const userContext = useContext(UserContext)
	if (userContext) {
		return userContext
	}
	throw new Error("useUser must be used within a UserProvider")
}
