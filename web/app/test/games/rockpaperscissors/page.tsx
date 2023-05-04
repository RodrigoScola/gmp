'use client'

import { baseUser } from "@/constants"
import { User } from "@/types"
import { useMemo, useState } from "react"
import { useUpdateEffect } from "usehooks-ts"



export default function ROCKPAPERSCISSORSPAGE() {
    const [currentPlayer, setCurrentPlayer] = useState<Player>({
        choice: null,
        id: baseUser.id,

    })
    const [opponent, setPlayer] = useState<Player>({
        choice: null,
        id: 'asdfasdfasd',
    })
    const [gameState, setGameState] = useState<GameState>(GameState.selecting)

    const [rounds, setRounds] = useState<Rounds>({
        count: 0,
        rounds: [
        ],
        wins: {
            [currentPlayer.id]: 0,
            [opponent.id]: 0
        }

    })

    const matchEnd = useMemo(() => {
        return gameState == GameState.end || Object.values(rounds.wins).some(item => item >= maxWins)
    }, [currentPlayer, opponent, gameState])
    const handleChoice = (option: options) => {
        if (matchEnd) return
        setGameState(GameState.waiting)
        setCurrentPlayer((current) => ({
            ...current, choice: option
        }))
        setTimeout(() => {
            setPlayer(current => ({
                ...current, choice: roption()
            }))
        }, Math.floor(Math.random() * 1000))
    }

    const newRound = (winner: Player, loser: Player, isTie: boolean = false) => {
        if (isTie) {
            setRounds(current => ({
                count: current.count + 1,
                rounds: [
                    ...current.rounds,
                    { winner: winner, loser: loser, isTie: true },

                ],
                wins: current.wins
            }))
            return
        }
        setRounds((current) => ({
            ...current,
            count: current.count + 1,
            rounds: [
                ...current.rounds,
                {
                    winner: winner,
                    loser: loser,
                    isTie: false
                }
            ],
            wins: {
                [winner.id]: current.wins[winner.id] + 1,
                [loser.id]: current.wins[loser.id]
            }

        }))
    }

    const handleResults = (p1: Player, p2: Player) => {
        const winner = getWinner(p1, p2)
        if (!winner) return newRound(p1, p2, true)
        const loser = winner == p1 ? p2 : p1
        newRound(winner, loser)
    }
    useUpdateEffect(() => {

        if (gameState == GameState.waiting && opponent.choice != null) {
            setGameState(GameState.results)
            handleResults(currentPlayer, opponent)
        }
    }, [opponent.choice])
    console.log(rounds)

    useUpdateEffect(() => {

        if (Object.values(rounds.wins).some(item => item >= maxWins)) {
            setGameState(GameState.end)
        } else {
            setTimeout(() => {
                setGameState(GameState.selecting)
                setPlayer(current => ({
                    ...current, choice: null
                }))
            }, 500)
        }
    }, [rounds.count])



    return <div>state : {gameState}

        <div className="gap-2 flex flex-row"><div className="flex">
            {[0, 1, 2, 3, 4].map((v, i) => {
                return <div className={`w-6 h-6 outline outline-2 gap-2 rounded-full ${i < rounds.wins[currentPlayer.id] ? 'bg-red-50' : null} `} key={i}>
                </div>
            })}
            <div>
                {currentPlayer.id}
            </div>
        </div>
            <div className="flex">
                {[0, 1, 2, 3, 4].map((v, i) => {
                    return <div className={`w-6 h-6 outline outline-2 gap-2 rounded-full ${i < rounds.wins[opponent.id] ? 'bg-red-50' : null} `} key={i}>
                    </div>
                })}
                <div>
                    {opponent.id}
                </div>
            </div>
        </div>
        {
            gameState == GameState.selecting && (
                <div className="gap-3 flex">
                    {
                        options.map((option) => (
                            <button key={option} onClick={() => {
                                handleChoice(option)
                            }}>{option}</button>
                        ))
                    }
                </div>
            )
        }
        {
            gameState == GameState.waiting && (
                <div>
                    <div>
                        waiting for opponents choice
                    </div>
                    <div>
                        {currentPlayer.choice}
                    </div>
                </div>
            )
        }
        {
            gameState == GameState.results && (
                <div>
                    <div>
                        Your choice: {currentPlayer.choice}
                    </div>
                    <div>
                        opponents choice: {opponent.choice}
                    </div>
                    <div>
                        you : {!getWinner(currentPlayer, opponent) ? 'tie' : getWinner(currentPlayer, opponent)?.id == currentPlayer.id ? 'won' : 'lost'}
                    </div>
                </div>
            )
        }
        {
            matchEnd && (
                <div>
                    <div>THe winner is</div>
                    {
                        Object.values(rounds.wins).some(item => item >= maxWins) ? (
                            <div>
                                {currentPlayer.id}
                            </div>
                        ) : (
                            <div>
                                {opponent.id}
                            </div>
                        )
                    }
                </div>
            )
        }




    </div>
}