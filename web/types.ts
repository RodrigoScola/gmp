import { UsersResponse } from "./pocketbase-types"

export type User<T = never> = Omit<UsersResponse<T>, "emailVisibility" | "collectionId" | "collectionName" | "updated" | "created"> & Partial<Pick<UsersResponse<T>, "verified" | "updated" | "created" | "expand">>

export type ChildrenType = React.ReactNode | React.ReactNode[] | JSX.Element | JSX.Element[]

export type Badges = {
	totalBadges: number
	badges: Badge[]
}

export type Badge = {
	id: number
	name: string
	description: string
	created: string
}

export type Direction = "up" | "down" | "left" | "right"

export type GameNames = "Simon Says" | "connect Four" | "Rock Paper Scissors" | "Tic Tac Toe"

export const gameNames: GameNames[] = ["Simon Says", "connect Four", "Rock Paper Scissors", "Tic Tac Toe"]

export enum SimonGameState {
	START = "Start",
	PLAYING = "Playing",
	END = "End",
	WAITING = "Waiting",
}
export type Coords = {
	x: number
	y: number
}
export enum TicTacToeGameState {
	START = "Start",
	PLAYING = "Playing",
	END = "End",
	TIE = "TIE",
	ENEMYTURN = "Enemy Turn",
	WAITING = "Waiting",
}
export interface GameType {
	name: GameNames
	id: number
}

export interface FriendGameType extends GameType {
	played: number
	won: number
	lost: number
}
export interface SimonSaysGameType extends FriendGameType {
	name: "Simon Says"
}
export interface ConnectFourGameType extends FriendGameType {
	name: "connect Four"
}
export interface RockPaperScissorsGameType extends FriendGameType {
	name: "Rock Paper Scissors"
}
export interface TicTacToeGameType extends FriendGameType {
	name: "Tic Tac Toe"
}

export type FriendsGamesType = {
	simonSays: SimonSaysGameType
	connectFour: ConnectFourGameType
	rockPaperScissors: RockPaperScissorsGameType
	ticTacToe: TicTacToeGameType
}

export interface ExtendedUser {
	badges?: Badges
	games?: FriendsGamesType
}

export interface ExtendedFriend extends ExtendedUser {
	note?: string
}

export type OnlineStatusType = "online" | "offline" | "away"

export interface Friend extends User<ExtendedFriend> {
	status: OnlineStatusType
}

export type ChatMessageType = {
	userId: string
	message: string
	created: string
	id: string
}
export type ChatConversationType = {
	id: string
	users: Partial<User> & { id: string }[]
	messages: ChatMessageType[]
}
export type ReturnUserType = User | User<Partial<ExtendedUser>>
