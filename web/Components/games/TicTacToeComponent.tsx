"use client";
import { baseUrl, baseUser } from "@/constants";
import { useUser } from "@/hooks/useUser";
import { newSocketAuth, socket } from "@/lib/socket";
import { useEffect, useMemo, useState } from "react";
import { useEffectOnce } from "usehooks-ts";
import { generateBoard, isValid } from "../../../shared/src/game/TicTacToeGame";
import {
     GameComponentProps,
     GameNames,
     TTCCombination,
     TTCMove,
     TTCOptions,
     TTCPlayer,
     TicTacToeGameState,
} from "../../../shared/src/types/game";
import { IUser } from "../../../shared/src/types/users";

type TicTacToeState = {
     moves: TTCMove[];
     winner: {
          id: string | null | "tie";
          board: TTCMove[] | null;
     };
     wins: {
          [k: string]: number;
     };
};
export default function TicTacToeGameComponent(props: GameComponentProps) {
     const [moves, setMoves] = useState<TicTacToeState>({
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

     const [player, setPlayer] = useState<
          | (IUser & { choice: TTCOptions | null })
          | { id: string; choice: TTCOptions | null }
     >({
          choice: null,
          id: "string2",
     });

     const [_, setOpponent] = useState<
          (IUser & { choice: TTCOptions | null }) | { id: string }
     >({
          id: "string",
     });
     const [board, setBoard] = useState<TTCMove[][]>(generateBoard());
     const [gameState, setGameState] = useState<TicTacToeGameState>(
          TicTacToeGameState.WAITING
     );
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
          } else {
               setGameState(TicTacToeGameState.PLAYING);
          }
     }, [canPlay]);

     const addBlock = (x: number, y: number) => {
          // console.log(isValid(board, x, y));
          // console.log(player.choice);
          if (
               player.choice == null ||
               canPlay == false ||
               isValid(board, x, y) == false ||
               !user
          )
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
     console.log(props);
     useEffect(() => {
          if (!user) return;
          const socketAuth = newSocketAuth({
               user: user,
               roomId: props.game.id,
               gameName: props.game.match.game.name as GameNames,
          });
          socket.auth = socketAuth;
          socket.connect();
          socket.emit("join_room", props.game.id);

          socket.on("get_players", (players: TTCPlayer[]) => {
               const opponent = players.find((player) => player.id != user.id);
               if (opponent) {
                    setOpponent(opponent);
               }
               const player = players.find((player) => player.id == user.id);
               if (player) {
                    setPlayer({
                         ...player,
                         choice: player.choice ?? "O",
                    });
               }
               socket.on("ttc_choice", (move: any) => {
                    console.log(move);
                    setMoves((current) => ({
                         ...current,

                         moves: [...current.moves, move.move],
                    }));
                    console.log(move.board);
                    setBoard(move.board);
               });

               socket.emit("player_ready");
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
          });
          socket.on("start_game", () => {
               socket.emit("get_state", (state: any) => {
                    console.log(user.id);
                    console.log(state);
               });
          });
          socket.on("ttc_game_winner", (winner: TTCCombination) => {
               if (!winner) return;

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
               window.location.href = `${baseUrl}/play/${props.game.id}/result`;
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
     return (
          <>
               <div>
                    {board.map((row: (TTCMove | null)[], i: number) => {
                         return (
                              <div className="flex m-auto w-fit" key={i}>
                                   {row.map(
                                        (col: TTCMove | null, j: number) => {
                                             let clas = "";
                                             if (moves.winner?.board) {
                                                  const found =
                                                       moves.winner.board.find(
                                                            (b) =>
                                                                 b.coords.x ==
                                                                      i &&
                                                                 b.coords.y == j
                                                       );
                                                  if (found) {
                                                       clas = "bg-green-500";
                                                  }
                                             }

                                             return (
                                                  <div
                                                       onClick={() => {
                                                            addBlock(i, j);
                                                       }}
                                                       key={j}
                                                       className={`${clas} h-24 w-24 border border-white flex align-middle justify-center items-center`}
                                                  >
                                                       <div className="relative text-4xl">
                                                            {col?.choice}
                                                       </div>
                                                  </div>
                                             );
                                        }
                                   )}
                              </div>
                         );
                    })}
               </div>
               <div className="w-fit m-auto">
                    {moves.winner && gameState == TicTacToeGameState.END && (
                         <div>
                              {moves.winner.id == "tie" ? (
                                   <div>ITS A TIE</div>
                              ) : (
                                   <div>
                                        {moves.winner.id == user?.id
                                             ? "YOU WON"
                                             : "YOU LOST"}
                                   </div>
                              )}
                         </div>
                    )}
                    <div>{gameState}</div>
                    {/* <div>restart</div> */}
               </div>
          </>
     );
}
