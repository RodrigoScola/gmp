"use client"
import { pb } from "@/db/pocketbase"
import { UsersRecord, UsersResponse } from "@/pocketbase-types"
import { ChildrenType, ExtendedUser, User } from "@/types"
import { Admin, RecordAuthResponse } from "pocketbase"
import { createContext, useCallback, useContext, useState } from "react"
import { useUpdateEffect } from "usehooks-ts"

interface UserContext {
	user: User<ExtendedUser>
	setCurrentUser: (user: User) => void
	login: (email: string, password: string) => Promise<RecordAuthResponse<UsersRecord>>
	logout: () => void
}
export const UserContext = createContext<UserContext | null>(null)

export const UserProvider = ({ children }: { children: ChildrenType }) => {
	const [token, setTOken] = useState(pb.authStore.token)
	const [currentUser, setCurrentUser] = useState<User<ExtendedUser> | Admin | Record>(pb.authStore.model )


	useUpdateEffect(() => {
		return pb.authStore.onChange((token, model) => {
			setCurrentUser(model)
			setTOken(token)
		})
	},[pb.authStore])
	const login = useCallback(async (email: string, password: string) => {
		return await pb.collection("users").authWithPassword(email, password) 
	  }, [])
	  const logout = useCallback(() => {
		pb.authStore.clear();
	  }, []);
	return (
		<UserContext.Provider
			value={{
				user: currentUser,
				login,
				logout
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
