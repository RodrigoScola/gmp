import { UsersRecord, UsersResponse } from "@/pocketbase-types"
import { User as UserType } from "@/types"
import { pb } from "./pocketbase"

type UserClassConstructor = {
	id: string
}

const getUser = async (id: string): Promise<UserType> => {
	const user: Awaited<UserType> = await fetch(`http://127.0.0.1:8090/api/collections/users/records/${id}`).then((res) => res.json())

	return newUser(user)
}

export const getUserByUsername = async (username: string): Promise<UserType> => {
	const user = await pb.collection("users").getList<UsersResponse>(1, 1, {
		filter: `username = '${username}'`,
	})
	if (user.items.length == 0) {
		return newUser()
	}
	return newUser(user.items[0])
}

export class User {
	private _info?: UserType
	id: string
	constructor({ id }: UserClassConstructor) {
		this.id = id
	}
	async getUser(): Promise<UserType | undefined> {
		if (this._info) {
			return this._info
		}
		return await getUser(this.id)
	}
}

export const newUser = (data?: Partial<UserType> | undefined | null): UserType => {
	return {
		email: data?.email ?? "defaultEmail@gmail.com",
		id: data?.id || "-1",
		username: data?.username || "defaultUsername",
		verified: data?.verified || false,
		avatar: data?.avatar || "",
		name: data?.name || "defaultName",
		created: data?.created || new Date().toISOString(),
		updated: data?.updated || new Date().toISOString(),
	}
}
