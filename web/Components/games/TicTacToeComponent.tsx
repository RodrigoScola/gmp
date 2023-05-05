"use client";
import { baseUser } from "@/constants";
import { socket } from "@/lib/socket";
import { Coords, TicTacToeGameState } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { useEffectOnce, useUpdateEffect } from "usehooks-ts";
import { TicTacToeMove } from "@/types";
import {
  generateboard,
  isValid,
  checkBoard,
  newBlock,
} from "@/../server/src/game/TicTacToeGame";
import { useUser } from "@/hooks/useUser";

const gameId = "a0s9df0a9sdjf";
const sendLetter = (
  board: TicTacToeMove[][]
): Promise<TicTacToeMove | null> => {
  return new Promise((resolve) => {
    let availableOptions: number[][] = [];
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (isValid(board, i, j)) {
          availableOptions.push([i, j]);
        }
      }
    }
    if (availableOptions.length === 0) {
      resolve(null);
      return;
    }
    const pos =
      availableOptions[Math.floor(Math.random() * availableOptions.length)];
    let b = newBlock({
      coords: {
        x: pos[0],
        y: pos[1],
      },
      type: "O",
      userId: "asoidufaosduf0av09asf",
    });
    setTimeout(() => {
      resolve(b);
    }, 1000);
  });
};
// add round

type TicTacToeState = {
  moves: TicTacToeMove[];
  winner?: {
    id: string | null | "tie";
    board: TicTacToeMove[] | null;
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

  const [board, setBoard] = useState<TicTacToeMove[][]>(generateboard());
  const [gameState, setGameState] = useState<TicTacToeGameState>(
    TicTacToeGameState.WAITING
  );

  const addToBoard = async (x: number, y: number) => {
    let nb = [...board];
    const block = newBlock({
      type: "X",
      coords: {
        x,
        y,
      },
      userId: baseUser.id,
    });
    if (!isValid(board, x, y)) return;

    nb[x][y] = block;

    setMoves((curr) => ({
      ...curr,
      moves: [...curr.moves, block],
    }));

    setGameState(TicTacToeGameState.ENEMYTURN);
    setBoard(nb);
  };
  console.log(moves);
  const canPlay = useMemo(() => {
    if (isValid(board)) {
      return false;
    }

    return true;
  }, [board]);
  const addBlock = (x: number, y: number) => {
    if (canPlay == false) return;
    addToBoard(x, y);
  };

  useUpdateEffect(() => {
    if (
      moves.moves[moves.moves.length - 1].userId == baseUser.id &&
      moves.moves.length > 0
    ) {
      console.log("asdf");
      if (canPlay) {
        setLetter();
      }
    }
  }, [moves.moves]);
  const setLetter = async () => {
    if (canPlay == false) return;
    const value = await sendLetter(board);
    if (!value) {
      console.log("game over");
      setGameState(TicTacToeGameState.END);
      return;
    }
    const move = newBlock(value);
    setMoves((curr) => ({ ...curr, moves: [...curr.moves, move] }));
    let nb = [...board];
    nb[move.coords.x][move.coords.y] = move;
    setBoard(nb);
    setGameState(TicTacToeGameState.PLAYING);
  };
  useEffectOnce(() => {
    setGameState(TicTacToeGameState.PLAYING);
  });

  const { user } = useUser();
  useEffect(() => {
    socket.auth = { user, roomId: gameId };
    socket.connect();
    socket.emit("join_room", gameId);

    socket.emit("start_game");

    // socket.emit('set-user', user)

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);
  useUpdateEffect(() => {
    const result = checkBoard(board);
    console.log(result);
    if (result.winner) {
      setMoves((current) => ({
        ...current,
        winner: {
          board: result.board,
          id: result.winner || "tie",
        },
      }));
      setGameState(TicTacToeGameState.END);
      console.log(moves);
    }
  }, [board]);

  useEffectOnce(() => {
    socket.auth = {
      baseUser,
      roomId: gameId,
    };
    socket.connect();
    socket.emit("join_room", gameId);
    socket.on("connect", () => {
      socket.emit("start_game");
    });
  });

  return (
    <>
      <div>
        {board.map((row: (TicTacToeMove | null)[], i: number) => {
          return (
            <div className="flex m-auto w-fit" key={i}>
              {row.map((col: TicTacToeMove | null, j: number) => {
                let clas = "";
                if (moves.winner?.board) {
                  const found = moves.winner.board.find(
                    (b) => b.coords.x == i && b.coords.y == j
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
                    <div className="relative text-4xl">{col?.type}</div>
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
              <div>
                {moves.winner.id == baseUser.id ? "YOU WON" : "YOU LOST"}
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
