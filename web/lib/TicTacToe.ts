import { TicTacToeMove } from "@/app/test/games/tictactoe/page"

export type Result = {
	winner: string | null
	isTie: boolean
	board: TicTacToeMove[] | null
}

export const checkLine = (diagonal: TicTacToeMove[]): boolean => {
	if (diagonal.length === 0) return false
	for (let i = 0; i < diagonal.length; i++) {
		if (diagonal[i]?.type !== diagonal[0]?.type) {
			return false
		}
	}
	return true
}
export const checkBoard = (board: TicTacToeMove[][]): Result => {
	let winner: Result = {
		winner: null,
		board: null,
		isTie: false
	}
	for (let i = 0; i < board.length; i++) {
		if (checkLine(board[i])) {
			winner.winner = board[i][0]?.userId
			winner.board = board[i]
		}
		let col = board.map((row) => row[i])
		if (checkLine(col)) {
			winner.winner = col[0]?.userId
			winner.board = col
		}
	}


	let diag1 = board.map((row, index) => row[index])

	if (checkLine(diag1)) {
		winner.winner = diag1[0]?.userId
		winner.board = diag1
	}
	let diag2 = board.map((row, index) => row[board.length - index - 1])
	if (checkLine(diag2)) {
		winner.winner = diag2[0]?.userId
		winner.board = diag2
	}



	let isFull = true
	for (let i = 0; i < board.length; i++) {
		for (let j = 0; j < board[i].length; j++) {
			if (!board[i][j].type) {
				isFull = false
			}
		}
	}
	if (isFull == true && !winner.winner) {
		winner.isTie = true
		winner.winner = 'tie'
	}
	return winner
}
