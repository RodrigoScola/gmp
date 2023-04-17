import { TicTacToeMove } from "@/app/test/games/tictactoe/page"

export type Result = {
	winner: string | null
	board: TicTacToeMove[][]
}

export const checkDiagonal = (diagonal: TicTacToeMove[]): boolean => {
	if (diagonal.length === 0) return false
	for (let i = 0; i < diagonal.length; i++) {
		if (diagonal[i]?.type !== diagonal[0]?.type) {
			return false
		}
	}
	return true
}

export const checkBoard = (board: TicTacToeMove[][]) => {
	for (let i = 0; i < board.length; i++) {
		if (checkDiagonal(board[i])) {
			return {
				winner: board[i][0]?.userId,
				board: board,
			}
		}
		let col = board.map((row) => row[i])
		if (checkDiagonal(col)) {
			return {
				winner: col[0]?.userId,
				board: board,
			}
		}
	}

	let diag1 = board.map((row, index) => row[index])

	if (checkDiagonal(diag1)) {
		return {
			winner: diag1[0]?.userId,
			board: board,
		}
	}
	let diag2 = board.map((row, index) => row[board.length - index - 1])
	if (checkDiagonal(diag2)) {
		return {
			winner: diag2[0]?.userId,
			board: board,
		}
	}
	return {
		winner: null,
		board: board,
	}
}
