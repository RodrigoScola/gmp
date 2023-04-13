"use client"
import { useMemo, useRef, useState } from "react"
import { useUpdateEffect } from "usehooks-ts"
// play sound
// best score
// current score
// restart
// game lost
// game start

enum GameState {
	START = "Start",
	PLAYING = "Playing",
	ENEMY_TURN = "Enemy Turn",
	END = "End",
	WAITING = "Waiting",
}
type ColorRefs = {
	red: React.RefObject<HTMLButtonElement | null>
	blue: React.RefObject<HTMLButtonElement | null>
	green: React.RefObject<HTMLButtonElement | null>
	yellow: React.RefObject<HTMLButtonElement | null>
}
type ColorType = "blue" | "green" | "yellow" | "red"
const genRandomSequence = (num: number): ColorType[] => {
	const colors: ColorType[] = ["blue", "green", "yellow", "red"]

	const sequence = []
	for (let i = 0; i < num; i++) {
		const randomColor = colors[Math.floor(Math.random() * colors.length)]
		sequence.push(randomColor)
	}
	return sequence
}

export default function SimonSaysPAGE() {
	const [colors, _] = useState(["blue", "green", "yellow", "red"])
	const [gameState, setGameState] = useState<GameState>(GameState.WAITING)
	const [sequence, setSequence] = useState<ColorType[]>(["green", "blue", "blue", "blue", "red"])
	const [playerSequence, setPlayerSequence] = useState<string[]>([])

	const [refs, setRefs] = useState<ColorRefs>({
		red: useRef<HTMLButtonElement | null>(null),
		blue: useRef<HTMLButtonElement | null>(null),
		green: useRef<HTMLButtonElement | null>(null),
		yellow: useRef<HTMLButtonElement | null>(null),
	})
	const canPlay = useMemo(() => {
		if (gameState == GameState.PLAYING) {
			return true
		}
		return false
	}, [gameState])
	const gameLost = () => {
		setGameState(GameState.END)
	}

	const addToSequence = (color: ColorType) => {
		if (!canPlay) return
		blink(refs[color].current as HTMLButtonElement, 1)
		setPlayerSequence([...playerSequence, color])
	}

	useUpdateEffect(() => {
		if (playerSequence[playerSequence.length - 1] == sequence[playerSequence.length - 1]) {
			console.log("same")
		} else {
			gameLost()
		}
		if (playerSequence.length == sequence.length) {
			setPlayerSequence([])
			setSequence([...sequence, ...genRandomSequence(1)])
		}
	}, [playerSequence])

	useUpdateEffect(() => {
		const ncolors: ColorType[] = [...sequence]
		setGameState(GameState.WAITING)
		const intervaliId = setInterval(() => {
			const color = ncolors.shift()
			if (!color) {
				clearInterval(intervaliId)
				setGameState(GameState.PLAYING)
				return
			}
			blink(refs[color].current as HTMLButtonElement, 1)
		}, 1000)
	}, [sequence])

	const blink = (ref: HTMLButtonElement, time: number) => {
		const color = ref.name
		ref?.classList.add(`simon_${color}_blink`)
		setTimeout(() => {
			ref?.classList.remove(`simon_${color}_blink`)
		}, 100 * time)
	}
	return (
		<div>
			<div claassName="flex">
				<div>
					best score
					{playerSequence.length}
				</div>
				<div>
					current Score
					{playerSequence.length}
				</div>

				<button>restart</button>
			</div>
			<div className="grid grid-cols-2 gap-4 w-fit m-auto">
				{colors.map((color) => {
					return <button disabled={!canPlay} key={`button_${color}`} name={color} ref={refs[color as keyof ColorRefs]} onClick={() => addToSequence(color as ColorType)} className={`simon_${color} h-40 w-40`}></button>
				})}
			</div>
		</div>
	)
}
