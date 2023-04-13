import { GameNames, GameType } from "@/types"

export const games: Record<number, GameType> = {
	0: {
		id: 0,
		name: "connect Four",
	},
	1: {
		id: 1,
		name: "Tic Tac Toe",
	},
	2: {
		id: 2,
		name: "Rock Paper Scissors",
	},
	3: {
		id: 3,
		name: "Simon Says",
	},
}
export const getGame = (gameIdOrName: GameNames | number): GameType => {
	if (typeof gameIdOrName === "number") {
		const game = games[gameIdOrName]
		if (game) return game
		else throw new Error("Game not found")
	} else {
		const game = Object.values(games).find((game) => game.name === gameIdOrName)
		if (game) return game
		else throw new Error("Game not found")
	}
}
