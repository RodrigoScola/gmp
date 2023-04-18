'use client'

import { baseUser } from "@/constants"
import { useState } from "react"
import { useUpdateEffect } from "usehooks-ts"

type options = 'rock' | 'paper' | 'scissors'
const options: options[] = ['rock', 'paper', 'scissors']
const roption = (): options => options[Math.floor(Math.random() * options.length)]
type Combination = {
    winner: options,
    loser: options,
    ties?: options
}
const combinations: Combination[] = [
    { winner: 'rock', loser: 'scissors', },
    { winner: 'paper', loser: 'rock', },
    { winner: 'scissors', loser: 'paper', },
]

const getWinnerCombination = (opt1: options, opt2: options): options => {
    const combination = combinations.find((combination) => {
        return (combination.winner == opt1 && combination.loser == opt2) || (combination.winner == opt2 && combination.loser == opt1)
    })
    console.log(combination)
    if (combination) {
        return combination.winner
    }
    return opt1
}
const getWinner = (p1: Player, p2: Player): Player => {
    if (!p1.choice || !p2.choice) throw new Error('invalid players')
    if (p1.choice == p2.choice) {
        return p1
    }
    if (getWinnerCombination(p1.choice, p2.choice) == p1.choice) {
        return p1
    }
    return p2
}
enum GameState {
    selecting,
    waiting,
    playing,
    results,
    end
}
type Player = {
    choice: options | null,
    userId: string,
    wins: number
}

type Round = {
    winner: Player,
    loser: Player
}
type Rounds = {
    count: number,
    rounds: Round[]
}


const maxWins = 5;

export default function ROCKPAPERSCISSORSPAGE() {
    const [currentPlayer, setCurrentPlayer] = useState<Player>({
        choice: null,
        userId: baseUser.id,
        wins: 0
    })
    const [gameState, setGameState] = useState<GameState>(GameState.selecting)

    const [rounds, setRounds] = useState<Rounds>({
        count: 0,
        rounds: [
        ]
    })
    const [opponent, setPlayer] = useState<Player>({
        choice: null,
        userId: 'asdfasdfasd',
        wins: 0
    })


    const handleChoice = (option: options) => {

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
    const handleResults = (p1: Player, p2: Player) => {
        const winner = getWinner(p1, p2)
        if (winner == p1) {
            setCurrentPlayer(current => ({
                ...current, wins: current.wins + 1
            }))
        } else {
            setPlayer(current => ({
                ...current, wins: current.wins + 1
            }))
        }
        setRounds(current => ({
            count: current.count + 1,
            rounds: [
                ...current.rounds, {
                    winner: getWinner(p1, p2),
                    loser: getWinner(p1, p2) == p1 ? p1 : p2
                }
            ]
        }))
    }
    useUpdateEffect(() => {

        if (gameState == GameState.waiting && opponent.choice != null) {

            setGameState(GameState.results)
            handleResults(currentPlayer, opponent)

            setTimeout(() => {
                setGameState(GameState.selecting)
                setPlayer(current => ({
                    ...current, choice: null
                }))
            }, 2000)
        }
    }, [opponent.choice])
    console.log(rounds)

    useUpdateEffect(() => {

        if (currentPlayer.wins == maxWins) {
            setGameState(GameState.end)
        }
        if (opponent.wins == maxWins) {
            setGameState(GameState.end)
        }
    }, [currentPlayer.wins, opponent.wins])



    return <div>state : {gameState}

        <div className="gap-2 flex flex-row"><div className="flex">
            {[0, 1, 2, 3, 4].map((v, i) => {
                return <div className={`w-6 h-6 outline outline-2 gap-2 rounded-full ${i < currentPlayer.wins ? 'bg-red-50' : null} `} key={i}>
                </div>
            })}
            <div>
                {currentPlayer.userId}
            </div>
        </div>
            <div className="flex">
                {[0, 1, 2, 3, 4].map((v, i) => {
                    return <div className={`w-6 h-6 outline outline-2 gap-2 rounded-full ${i < opponent.wins ? 'bg-red-50' : null} `} key={i}>
                    </div>
                })}
                <div>
                    {opponent.userId}
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
                        you : {getWinner(currentPlayer, opponent).userId == currentPlayer.userId ? 'won' : 'lost'}
                    </div>
                </div>
            )
        }
        {
            gameState == GameState.end && (
                <div>
                    <div>THe winner is</div>
                    {
                        currentPlayer.wins == maxWins ? (
                            <div>
                                {currentPlayer.userId}
                            </div>
                        ) : (
                            <div>
                                {opponent.userId}
                            </div>
                        )
                    }
                </div>
            )
        }




    </div>
}