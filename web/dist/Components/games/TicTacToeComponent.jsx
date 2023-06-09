"use client";
import { baseUser } from "@/constants";
import { useBackgroundColor } from "@/hooks/useBackgroundColor";
import { useUser } from "@/hooks/useUser";
import { newSocketAuth, socket } from "@/lib/socket";
import { useEffect, useMemo, useState } from "react";
import { useEffectOnce, useUpdateEffect } from "usehooks-ts";
import { generateBoard, isValid } from "../../../shared/src/game/TicTacToeGame";
import { TicTacToeGameState, } from "../../../shared/src/types/game";
import { PointsComponent } from "../PointsComponent";
export default function TicTacToeGameComponent(props) {
    const [moves, setMoves] = useState({
        moves: [],
        winner: {
            id: null,
            board: [],
        },
        wins: {
            [baseUser.id]: 0,
            aoisdjfoisd: 0,
        },
    });
    const { user } = useUser();
    const [player, setPlayer] = useState({
        choice: null,
        id: user?.id ?? "stin",
        wins: 0,
    });
    const [opponent, setOpponent] = useState({
        username: "Yet to be found",
        id: "string",
        wins: 0,
    });
    const [board, setBoard] = useState(generateBoard());
    const [gameState, setGameState] = useState(TicTacToeGameState.WAITING);
    const canPlay = useMemo(() => {
        if (isValid(board) || !user) {
            return false;
        }
        if (!user.id) {
            return false;
        }
        if (moves.moves[moves.moves.length - 1]?.id == user.id) {
            return false;
        }
        if (moves.moves.length == 0 && player.choice == "O") {
            return false;
        }
        return true;
    }, [board, moves, player.choice]);
    useEffect(() => {
        // console.log(moves);
        if (canPlay == false) {
            setGameState(TicTacToeGameState.ENEMYTURN);
            return;
        }
        else {
            setGameState(TicTacToeGameState.PLAYING);
        }
    }, [canPlay]);
    const addBlock = (x, y) => {
        if (player.choice == null ||
            canPlay == false ||
            isValid(board, x, y) == false ||
            !user)
            return;
        socket.emit("ttc_choice", {
            board,
            move: {
                id: user.id,
                choice: player.choice,
                coords: {
                    x,
                    y,
                },
            },
        });
    };
    useEffectOnce(() => {
        setGameState(TicTacToeGameState.PLAYING);
    });
    useEffect(() => {
        if (!user)
            return;
        const socketAuth = newSocketAuth({
            user: user,
            roomId: props.gameId,
            gameName: props.gameName,
        });
        socket.auth = socketAuth;
        socket.connect();
        socket.emit("join_room", props.gameId);
        socket.on("get_players", (players) => {
            const opponent = players.find((player) => player.id != user.id);
            if (opponent) {
                setOpponent((curr) => ({
                    ...curr,
                    ...opponent,
                }));
            }
            const player = players.find((player) => player.id == user.id);
            if (player) {
                setPlayer({
                    ...player,
                    choice: player.choice ?? "O",
                    wins: 0,
                });
            }
            socket.emit("player_ready");
        });
        socket.on("ttc_choice", (move) => {
            setMoves((current) => ({
                ...current,
                moves: [...current.moves, move.move],
            }));
            setBoard(move.board);
        });
        socket.on("new_round", () => {
            setBoard(generateBoard());
            setMoves((current) => ({
                ...current,
                winner: {
                    board: [],
                    id: "",
                },
                moves: [],
            }));
            socket.emit("get_state", (state) => {
                const opponentWins = state.rounds.rounds.reduce((acc, curr) => {
                    if (!curr.isTie && curr.winner?.id !== user.id)
                        acc++;
                    return acc;
                }, 0);
                const playerWins = state.rounds.rounds.reduce((acc, curr) => {
                    if (!curr.isTie && curr.winner?.id == user.id)
                        acc++;
                    return acc;
                }, 0);
                setOpponent((curr) => ({ ...curr, wins: opponentWins }));
                setPlayer((curr) => ({ ...curr, wins: playerWins }));
            });
        });
        socket.on("ttc_game_winner", (winner) => {
            if (!winner)
                return;
            setMoves((current) => ({
                ...current,
                winner: {
                    id: winner.winner,
                    board: winner.board,
                },
            }));
            setGameState(TicTacToeGameState.END);
        });
        // socket.emit('set-user', user)
        socket.on("user_disconnected", () => {
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
    const background = useBackgroundColor();
    useUpdateEffect(() => {
        if (gameState == TicTacToeGameState.PLAYING) {
            background.changeBackgroundColor("bg-gray-700");
        }
        else if (gameState == TicTacToeGameState.ENEMYTURN) {
            background.changeBackgroundColor("bg-red-600");
        }
        else if (gameState == TicTacToeGameState.END) {
            background.changeBackgroundColor("bg-gray-700");
        }
        return () => {
            background.changeBackgroundColor("bg-gray-700");
        };
    }, [gameState]);
    console.log(opponent);
    return (<>
               <div className="mt-6">
                    <PointsComponent player1={{
            id: user?.id ?? "",
            username: user?.username ?? "",
            score: player.wins,
        }} player2={{
            id: opponent.id,
            username: opponent.username,
            score: opponent.wins,
        }}/>

                    {board.map((row, i) => {
            return (<div className="flex m-auto w-fit" key={i}>
                                   {row.map((col, j) => {
                    let clas = "";
                    if (moves.winner?.board) {
                        const found = moves.winner.board.find((b) => b.coords.x ==
                            i &&
                            b.coords.y == j);
                        if (found) {
                            clas += "bg-green-500";
                        }
                    }
                    return (<div onClick={() => {
                            addBlock(i, j);
                        }} key={j} className={`ttc_square_row_${i}_col_${j}  ${clas} ttc_square h-24 w-24 border-white  flex align-middle justify-center items-center`}>
                                                       <div className="relative  font-ginto font-black text-4xl">
                                                            {col?.choice}
                                                       </div>
                                                  </div>);
                })}
                              </div>);
        })}
               </div>
               <div className="w-fit m-auto mt-6">
                    {moves.winner && gameState == TicTacToeGameState.END && (<div className="">
                              {moves.winner.id == "tie" ? (<div>
                                        <p>
                                             ITS A{" "}
                                             <span className="font-ginto font-semibold">
                                                  TIE
                                             </span>
                                        </p>
                                   </div>) : (<div>
                                        <p className="font-ginto font-2xl">
                                             {moves.winner.id == user?.id
                    ? "YOU WON"
                    : "YOU LOST"}
                                        </p>
                                   </div>)}
                         </div>)}
                    <div className="mt-6">
                         <p className="text-2xl font-ginto font-semibold ">
                              {gameState}
                         </p>
                    </div>
                    {/* <div>restart</div> */}
               </div>
          </>);
}
