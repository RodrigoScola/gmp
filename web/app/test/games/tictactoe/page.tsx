"use client"
import { baseUser } from "@/constants"
import { checkBoard, } from "@/lib/TicTacToe"
import { Coords, TicTacToeGameState } from "@/types"
import { useState } from "react"
import { useEffectOnce, useUpdateEffect } from "usehooks-ts"
export type TicTacToeMove = {
	userId: string
	moveId: string
	coords: Coords
	type: "X" | "O" | null
}
const generateboard = (): TicTacToeMove[][] => {
	let rows: TicTacToeMove[][] = []
	for (let i = 0; i < 3; i++) {
		rows[i] = new Array(3).fill({
			userId: "asoidufaosduf0av09asf",
			moveId: Date.now().toString(),
			coords: {
				x: 0,
				y: 0,
			},
			type: null
		})
	}
	return rows
}


const isValid = (board: (TicTacToeMove | null)[][], x: number = 0, y: number = 0): boolean => {
	if (x < 0 || x > board.length || y < 0 || y > board.length) {
		return false
	}
	if (board[x][y]) {
		return false
	}
	return true
}
const sendLetter = (board: TicTacToeMove[][]): Promise<TicTacToeMove | null> => {
	return new Promise((resolve) => {
		let availableOptions: number[][] = []
		for (let i = 0; i < board.length; i++) {
			for (let j = 0; j < board.length; j++) {
				if (isValid(board, i, j)) {
					availableOptions.push([i, j])
				}
			}
		}
		if (availableOptions.length === 0) {
			resolve(null)
			return
		}
		const pos = availableOptions[Math.floor(Math.random() * availableOptions.length)]
		let b = newBlock({
			coords: {
				x: pos[0],
				y: pos[1],
			},
			type: "O",
			userId: "asoidufaosduf0av09asf",
		})
		setTimeout(() => {
			resolve(b)
		}, 1000)
	})
}

const newBlock = ({ coords, type, userId }: Partial<TicTacToeMove>): TicTacToeMove => {
	return {
		coords: {
			x: coords?.x ?? 0,
			y: coords?.y ?? 0,
		},
		moveId: Date.now().toString(),
		userId: userId ?? baseUser.id,
		type: type || "O",
	}
}

export default function TiCTACTOEPAGE() {
	const [board, setBoard] = useState<(TicTacToeMove)[][]>(generateboard())
	const [gameState, setGameState] = useState<TicTacToeGameState>(TicTacToeGameState.WAITING)

	const addToBoard = async (x: number, y: number) => {
		let nb = [...board]
		nb[x][y] = newBlock({
			type: "X",
			coords: {
				x,
				y,
			},
			userId: baseUser.id,
		})
		setGameState(TicTacToeGameState.ENEMYTURN)
		setBoard(nb)
	}
	const addBlock = (x: number, y: number) => {
		if (gameState !== TicTacToeGameState.PLAYING) return
		if (!isValid(board, x, y)) return
		addToBoard(x, y)

		setLetter()
	}
	const setLetter = async () => {

		if (!isValid(board)) return
		const value = await sendLetter(board)
		if (!value) {
			console.log("game over")
			setGameState(TicTacToeGameState.END)
			return
		}
		const move = newBlock(value)
		let nb = [...board]
		nb[move.coords.x][move.coords.y] = move
		setBoard(nb)
		setGameState(TicTacToeGameState.PLAYING)
	}
	useEffectOnce(() => {
		setGameState(TicTacToeGameState.PLAYING)
	})
	useUpdateEffect(() => {
		if (checkBoard(board).winner) {
			if (checkBoard(board).winner == baseUser.id) {
				setGameState(TicTacToeGameState.END)
			}
		}
	}, [board])

	return (
		<>
			<div>
				{board.map((row: (TicTacToeMove | null)[], i: number) => {
					return (
						<div className="flex" key={i}>
							{row.map((col: TicTacToeMove | null, j: number) => {
								return (
									<div
										onClick={() => {
											addBlock(i, j)
										}}
										key={j}
										className=" h-10 w-10 border border-black"
									>
										<div className="relative">{col?.type}</div>
									</div>
								)
							})}
						</div>
					)
				})}
			</div>
			<div>{gameState}</div>
			<div>restart</div>
		</>
	)
}
