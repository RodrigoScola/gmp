"use client";
import { useEffect, useMemo, useState } from "react";
import { RPSOptionsValues, } from "../../../shared/src/types/game";
import { useUser } from "@/hooks/useUser";
const maxWins = 5;
import { socket } from "@/lib/socket";
import { GamePlayState } from "../../../shared/src/types/users";
import { RockPaperScissorsGame } from "@/../shared/src/game/rockpaperScissors";
const { getWinner } = new RockPaperScissorsGame();
export default function RockPaperScissorGameComponent(props) {
    const [opponent, setOpponent] = useState({
        id: "string",
        choice: null,
    });
    const [gameState, setGameState] = useState(GamePlayState.selecting);
    const { user } = useUser();
    const [currentPlayer, setCurrentPlayer] = useState({
        choice: null,
        id: "string2",
    });
    const [rounds, setRounds] = useState({
        count: 0,
        rounds: [],
        wins: {
            ties: 0,
        },
    });
    const matchEnd = useMemo(() => {
        console.log(rounds.wins);
        if ((rounds.wins[currentPlayer.id] == maxWins ||
            rounds.wins[opponent.id] == maxWins) &&
            gameState == GamePlayState.end) {
            console.log("match end");
            return true;
        }
        return false;
    }, [rounds.wins[currentPlayer.id], gameState, rounds.wins[opponent.id]]);
    useEffect(() => {
        socket.auth = { user, roomId: props.gameId, gameName: props.gameName };
        socket.connect();
        socket.emit("join_room", props.gameId);
        socket.on("get_players", (players) => {
            const opponent = players.find((player) => player.id != user.id);
            if (opponent) {
                setOpponent(opponent);
            }
            const currentPlayer = players.find((player) => player.id == user.id);
            if (currentPlayer && currentPlayer.choice !== null) {
                setCurrentPlayer(currentPlayer);
            }
            if (currentPlayer && opponent) {
                setRounds({
                    count: 0,
                    rounds: [],
                    wins: {
                        ties: 0,
                        [currentPlayer.id]: 0,
                        [opponent.id]: 0,
                    },
                });
            }
            socket.emit("player_ready");
        });
        // socket.emit('set-user', user)
        socket.on("rps_choice", (choice) => {
            console.log(choice);
        });
        socket.on("round_winner", (round) => {
            if (!round)
                return;
            setGameState(GamePlayState.results);
            const opponentWin = round.winner.id == opponent.id;
            if (opponentWin) {
                setOpponent((current) => ({
                    ...current,
                    choice: round.winner.choice,
                }));
            }
            if (!round.isTie) {
                setRounds((current) => ({
                    ...current,
                    count: current.count + 1,
                    rounds: [...current.rounds, round],
                    wins: {
                        ...current.wins,
                        [round.winner.id]: current.wins[round.winner.id] + 1,
                    },
                }));
            }
            else {
                setRounds((current) => ({
                    ...current,
                    count: current.count + 1,
                    rounds: [...current.rounds, round],
                    wins: {
                        ...current.wins,
                        ties: current.wins.ties + 1,
                    },
                }));
            }
            console.log(rounds, "this is the round");
        });
        socket.on("rps_game_winner", (winner) => {
            if (winner) {
                setGameState(GamePlayState.end);
            }
        });
        socket.on("new_round", () => {
            handleNewRound();
        });
        socket.on("user_disconnected", () => {
            console.log("a");
            window.location.reload();
        });
        socket.on("disconnect", () => {
            console.log("user disconnected");
        });
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [socket]);
    const handleChoice = (choice) => {
        console.log(choice);
        socket.emit("rps_choice", {
            id: user.id,
            choice,
        });
        setGameState(GamePlayState.waiting);
    };
    const handleNewRound = () => {
        setGameState(GamePlayState.selecting);
        setOpponent((current) => ({
            ...current,
            choice: null,
        }));
        setCurrentPlayer((current) => ({
            ...current,
            choice: null,
        }));
    };
    const currentWinner = useMemo(() => {
        if (currentPlayer.choice == null || opponent.choice == null)
            return null;
        return getWinner(currentPlayer, opponent);
    }, []);
    return (<div>
      state : {gameState}
      <div className="gap-2 flex flex-row">
        <div className="flex">
          {[0, 1, 2, 3, 4].map((_, i) => {
            return (<div className={`w-6 h-6 outline outline-2 gap-2 rounded-full ${i < rounds.wins[currentPlayer.id] ? "bg-red-50" : null} `} key={i}></div>);
        })}
          <div>{currentPlayer.id}</div>
        </div>
        <div className="flex">
          {[0, 1, 2, 3, 4].map((_, i) => {
            return (<div className={`w-6 h-6 outline outline-2 gap-2 rounded-full ${i < rounds.wins[opponent.id] ? "bg-red-50" : null} `} key={i}></div>);
        })}
          <div>{opponent.id}</div>
        </div>
      </div>
      {gameState == GamePlayState.selecting && (<div className="gap-3 flex">
          {RPSOptionsValues.map((option) => (<button key={option} onClick={() => {
                    handleChoice(option);
                }}>
              {option}
            </button>))}
        </div>)}
      {gameState == GamePlayState.waiting && (<div>
          <div>waiting for opponents choice</div>
          <div>{currentPlayer.choice}</div>
        </div>)}
      {gameState == GamePlayState.results && (<div>
          <div>Your choice: {currentPlayer.choice}</div>
          <div>opponents choice: {opponent.choice}</div>

          {!currentWinner?.isTie && (<div>
              you :{" "}
              {currentWinner?.winner.id === currentPlayer.id ? "won" : "lost"}
            </div>)}
        </div>)}
      {matchEnd && (<div>
          <div>THe winner is</div>
          {Object.values(rounds.wins).some((item) => item >= maxWins) ? (<div>{currentPlayer.id}</div>) : (<div>{opponent.id}</div>)}
        </div>)}
    </div>);
}
