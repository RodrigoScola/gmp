"use client";
import { baseUser } from "@/constants";
import { newSocketAuth, socket } from "@/lib/socket";
import {
  GameNames,
  MoveChoice,
  TTCCombination,
  TTCOptions,
  TTCPlayer,
  TicTacToeGameState,
  User,
} from "@/types";
import { useEffect, useMemo, useState } from "react";
import { useEffectOnce } from "usehooks-ts";
import { TTCMove } from "@/types";
import {
  generateBoard,
  isValid,
  TTCBoardMove,
} from "@/../server/src/game/TicTacToeGame";
import { useUser } from "@/hooks/useUser";

const gameId = "a0s9df0a9sdjf";
const gameType: GameNames = "Tic Tac Toe";

type TicTacToeState = {
  moves: TTCBoardMove[];
  winner: {
    id: string | null | "tie";
    board: TTCBoardMove[] | null;
  };
  wins: {
    [k: string]: number;
  };
};
export default function TicTacToeGameComponent() {
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
    | (User & { choice: TTCOptions | null })
    | { id: string; choice: TTCOptions | null }
  >({
    choice: null,
    id: "string2",
  });

  const [opponent, setOpponent] = useState<
    (User & { choice: TTCOptions | null }) | { id: string }
  >({
    id: "string",
  });
  const [board, setBoard] = useState<MoveChoice<TTCMove>[][]>(generateBoard());
  const [gameState, setGameState] = useState<TicTacToeGameState>(
    TicTacToeGameState.WAITING
  );
  const canPlay = useMemo(() => {
    if (isValid(board)) {
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
    if (player.choice == null) return;
    if (canPlay == false) return;
    if (isValid(board, x, y) == false) return;

    socket.emit("ttc_choice", {
      board,
      move: {
        id: user.id,
        move: {
          choice: player.choice,
          coords: {
            x,
            y,
          },
        },
      },
    });
  };

  useEffectOnce(() => {
    setGameState(TicTacToeGameState.PLAYING);
  });

  useEffect(() => {
    const socketAuth = newSocketAuth({
      user: user,
      roomId: gameId,
      gameName: gameType,
    });
    socket.auth = socketAuth;
    socket.connect();
    socket.emit("join_room", gameId);

    socket.on("get_players", (players: TTCPlayer[]) => {
      const opponent = players.find((player) => player.id != user.id);
      if (opponent) {
        setOpponent(opponent);
      }
      const player = players.find((player) => player.id == user.id);
      if (player) {
        setPlayer(player);
      }
      socket.on("ttc_choice", (move) => {
        setMoves((current) => ({
          ...current,

          moves: [...current.moves, move.move],
        }));

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
  // useUpdateEffect(() => {
  //   const result = checkBoard(board);
  //   console.log(result);
  //   if (result.winner) {
  //     setMoves((current) => ({
  //       ...current,
  //       winner: {
  //         board: result.board,
  //         id: result.winner || "tie",
  //       },
  //     }));
  //     setGameState(TicTacToeGameState.END);
  //     console.log(moves);
  //   }
  // }, [board]);
  return (
    <>
      <div>
        {board.map((row: (MoveChoice<TTCMove> | null)[], i: number) => {
          return (
            <div className="flex m-auto w-fit" key={i}>
              {row.map((col: MoveChoice<TTCMove> | null, j: number) => {
                let clas = "";
                if (moves.winner?.board) {
                  const found = moves.winner.board.find(
                    (b) => b.move.coords.x == i && b.move.coords.y == j
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
                    className={`${clas} h-24 w-24 border border-black flex align-middle justify-center items-center`}
                  >
                    <div className="relative text-4xl">{col?.move.choice}</div>
                  </div>
                );
              })}
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
              <div>{moves.winner.id == user.id ? "YOU WON" : "YOU LOST"}</div>
            )}
          </div>
        )}
        <div>{gameState}</div>
        {/* <div>restart</div> */}
      </div>
    </>
  );
}
