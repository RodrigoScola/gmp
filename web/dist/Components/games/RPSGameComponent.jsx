"use client";
import { useBackgroundColor } from "@/hooks/useBackgroundColor";
import { useUser } from "@/hooks/useUser";
import { socket, usersSocket } from "@/lib/socket";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useUpdateEffect } from "usehooks-ts";
import { RPSOptionsValues, } from "../../../shared/src/types/game";
import { GamePlayState } from "../../../shared/src/types/users";
import PaperImage from "../../images/paper.png";
import RockImage from "../../images/rock.png";
import ScissorsImage from "../../images/scissors.png";
import { PointsComponent } from "../PointsComponent";
const maxWins = 5;
const getImage = (choice) => {
    switch (choice) {
        case "paper":
            return PaperImage;
        case "rock":
            return RockImage;
        case "scissors":
            return ScissorsImage;
    }
};
export default function RockPaperScissorGameComponent(props) {
    const [opponent, setOpponent] = useState({
        id: "defaultid",
        choice: null,
        username: "",
        created_at: Date.now().toString(),
        email: "",
    });
    const [currentWinner, setCurrentWinner] = useState(null);
    const background = useBackgroundColor();
    const [gameState, setGameState] = useState(GamePlayState.selecting);
    const { user } = useUser();
    const [currentPlayer, setCurrentPlayer] = useState({
        choice: null,
        id: "defaultid",
        created_at: Date.now().toString(),
        email: "",
        username: "",
    });
    const [rounds, setRounds] = useState({
        count: 0,
        rounds: [],
        wins: {
            ties: 0,
        },
    });
    const matchEnd = useMemo(() => {
        if ((rounds.wins[currentPlayer.id] == maxWins ||
            rounds.wins[opponent.id] == maxWins) &&
            gameState == GamePlayState.end) {
            console.log("match end");
            return true;
        }
        return false;
    }, [rounds.wins[currentPlayer.id], gameState, rounds.wins[opponent.id]]);
    useEffect(() => {
        if (!user)
            return;
        socket.auth = {
            user,
            roomId: props.gameId,
            gameName: props.gameName,
        };
        if (!usersSocket.connected) {
            usersSocket.auth = {
                user: user,
            };
            usersSocket.connect();
        }
        socket.connect();
        socket.emit("join_room", props.gameId);
        socket.on("get_players", (players) => {
            const opponent = players.find((player) => player.id != user.id);
            if (opponent) {
                setOpponent((curr) => ({
                    ...curr,
                    id: opponent.id,
                    choice: opponent.choice,
                }));
            }
            const currentPlayer = players.find((player) => player.id == user.id);
            if (currentPlayer && currentPlayer.choice !== null) {
                usersSocket.emit("get_user", currentPlayer.id, (data) => {
                    setCurrentPlayer((curr) => ({
                        ...curr,
                        ...data,
                        id: currentPlayer.id,
                        choice: currentPlayer.choice,
                    }));
                });
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
            setCurrentWinner(round);
            const opponentChoice = round.winner.id !== user.id
                ? round.winner.choice
                : round.loser.choice;
            setOpponent((curr) => ({ ...curr, choice: opponentChoice }));
            if (!round.isTie) {
                console.log(round.winner.id == currentPlayer.id);
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
            // window.location.href = `${baseUrl}/play/${props.gameId}/result`;
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
    useEffect(() => {
        if (!usersSocket.connected) {
            usersSocket.auth = {
                user: user,
            };
            usersSocket.connect();
            console.log("con");
        }
    }, []);
    useEffect(() => {
        if (opponent.id !== "defaultid" && opponent.email == "") {
            usersSocket.emit("get_user", opponent.id, (data) => {
                // console.log(data);
                setOpponent((old) => ({ ...old, ...data }));
            });
        }
        return () => { };
    }, [opponent.id]);
    useEffect(() => {
        if (currentPlayer.id !== "defaultid" && currentPlayer.email == "") {
            usersSocket.emit("get_user", currentPlayer.id, (data) => {
                console.table(data);
                setCurrentPlayer((old) => ({ ...old, ...data }));
            });
        }
        return () => { };
    }, [currentPlayer.id]);
    const handleChoice = (choice) => {
        if (!user)
            return;
        socket.emit("rps_choice", {
            id: user.id,
            choice,
        });
        setCurrentPlayer((current) => ({
            ...current,
            choice: choice,
        }));
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
    useUpdateEffect(() => {
        if (gameState == GamePlayState.selecting) {
            background.changeBackgroundColor("bg-blue-500");
        }
        else if (gameState == GamePlayState.waiting) {
            background.changeBackgroundColor("bg-orange-500");
        }
    }, [gameState]);
    return (<div className="pt-2">
               <PointsComponent player1={{
            ...currentPlayer,
            score: rounds.wins[currentPlayer.id],
        }} player2={{
            ...opponent,
            score: rounds.wins[opponent.id],
        }}/>
               {gameState == GamePlayState.selecting && (<div className="gap-5 flex mt-12 w-fit m-auto">
                         {RPSOptionsValues.map((option) => (<ChoiceCard key={option} onClick={() => {
                    handleChoice(option);
                }} choice={option}/>))}
                    </div>)}
               <div className="w-fit m-auto">
                    {gameState == GamePlayState.waiting && (<div>
                              <div className="mt-12">
                                   <p className="text-2xl  font-whitney">
                                        Waiting{" "}
                                        <span className="font-ginto font-semibold capitalize ">
                                             {opponent.username}{" "}
                                        </span>
                                        to choose.
                                   </p>
                              </div>
                              <div>
                                   {currentPlayer.choice && (<div>
                                             <p className="text-center">
                                                  Your choice
                                             </p>
                                             <div className="w-fit m-auto flex flex-col ">
                                                  <ChoiceCard choice={currentPlayer.choice}/>
                                             </div>
                                        </div>)}
                              </div>
                         </div>)}
                    {gameState == GamePlayState.results &&
            currentPlayer.choice &&
            opponent.choice && (<div className="">
                                   <div className="flex flex-row gap-2">
                                        <div>
                                             <p className="font-ginto font-semibold">
                                                  Your Choice
                                             </p>
                                             <ChoiceCard choice={currentPlayer.choice}/>
                                        </div>
                                        <div>
                                             <p className="font-ginto font-semibold font-lg">
                                                  Opponents Choice
                                             </p>
                                             <ChoiceCard choice={opponent.choice}/>
                                        </div>
                                   </div>
                                   <div className="text-center mt-6">
                                        {!currentWinner?.isTie ? (<div className="font-whitney font-semibold text-3xl">
                                                  Round{" "}
                                                  {currentWinner?.winner.id ===
                    currentPlayer.id
                    ? "Won"
                    : "Lost"}
                                             </div>) : (<div>
                                                  <p className="font-whitney font-semibold text-3xl">
                                                       Round Tied
                                                  </p>
                                             </div>)}
                                   </div>
                              </div>)}
                    {matchEnd && (<div>
                              <div>
                                   <h3>The Winner is</h3>
                              </div>
                              {Object.values(rounds.wins).some((item) => item >= maxWins) ? (<div>{currentPlayer.username}</div>) : (<div>{opponent.username}</div>)}
                         </div>)}
               </div>
          </div>);
}
const ChoiceCard = ({ choice, ...props }) => {
    return (<div {...props} className="selectable flex flex-col p-2 content-between justify-between   rounded-2xl shadow-lg">
               <Image className="object-cover" alt={`image for ${choice}`} src={getImage(choice).src} height={100} width={100}/>
               <p className="font-ginto font-semibold text-lg text-center capitalize">
                    {choice}
               </p>
          </div>);
};
