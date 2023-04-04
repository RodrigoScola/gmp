import { UsersResponse } from "./pocketbase-types"

export type User = Omit<UsersResponse, "emailVisibility" | "collectionId" | "collectionName" | "updated" | "created"> & Partial<Pick<UsersResponse, "verified" | "updated" | "created">>

export type ChildrenType = React.ReactNode | React.ReactNode[] | JSX.Element | JSX.Element[]

export interface Friend extends User {}
