"use client"
import { useState } from "react"
const colors = ["blue", "green", "yellow", "red"]

export default function SimonSaysPAGE() {
	const [gameState, setGameState] = useState({
		sequence: [],
		playerSequence: [],
	})

	return (
		<div>
			<div className="grid grid-cols-2">
				{colors.map((color) => {
					console.log(color)
					return <button disabled={false} onClick={() => console.log("s")} key={color} className={`h-96 w-96 bg-${color}-300`} id={`${color}`}></button>
				})}
			</div>
		</div>
	)
}
