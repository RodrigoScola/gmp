"use client";
import { baseUser } from "@/constants";
import { checkBoard } from "../../../../../shared/game/TicTacToeGame";
import { useMemo, useState } from "react";
import { useEffectOnce, useUpdateEffect } from "usehooks-ts";
import { TTCMove, TicTacToeGameState } from "../../../../../shared/types/game";
const generateboard = (): TTCMove[][] => {
  let rows: TTCMove[][] = [];
  for (let i = 0; i < 3; i++) {
    rows[i] = new Array(3).fill({
      userId: null,
      moveId: Date.now().toString(),
      coords: {
        x: 0,
        y: 0,
      },
      type: null,
    });
  }
  return rows;
};
const isValid = (
  board: TTCMove[][],
  x: number = -1,
  y: number = -1
): boolean => {
  if (x < 0 || x > board.length || y < 0 || y > board.length) {
    return false;
  }
  if (board[x][y]?.choice) {
    return false;
  }
  if (checkBoard(board).winner) return false;
  return true;
};
const sendLetter = (board: TTCMove[][]): Promise<TTCMove | null> => {
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
      choice: "O",
      id: "asoidufaosduf0av09asf",
    });
    setTimeout(() => {
      resolve(b);
    }, 1000);
  });
};
// add round
const newBlock = ({ coords, choice, id }: TTCMove): TTCMove => {
  return {
    coords: {
      x: coords?.x ?? 0,
      y: coords?.y ?? 0,
    },
    id: id ?? baseUser.id,
    choice: choice || "O",
  };
};

type TicTacToeState = {
  moves: TTCMove[];
  winner?: {
    id: string | null | "tie";
    board: TTCMove[] | null;
  };
  wins: {
    [k: string]: number;
  };
};
export default function TiCTACTOEPAGE() {
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

  const [board, setBoard] = useState<TTCMove[][]>(generateboard());
  const [gameState, setGameState] = useState<TicTacToeGameState>(
    TicTacToeGameState.WAITING
  );

  const addToBoard = async (x: number, y: number) => {
    let nb = [...board];
    const block = newBlock({
      choice: "X",
      coords: {
        x,
        y,
      },
      id: baseUser.id,
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
      moves.moves[moves.moves.length - 1].id == baseUser.id &&
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
  useUpdateEffect(() => {
    const result = checkBoard(board);
    console.log(result);
    if (result.winner) {
      setMoves((current) => ({
        moves: current.moves,
        winner: {
          id: result.winner,
          board: result.board,
        },
        wins: {
          ...current.wins,
        },
      }));
      setGameState(TicTacToeGameState.END);
      console.log(moves);
    }
  }, [board]);
  return (
    <>
      <div>
        {board.map((row: (TTCMove | null)[], i: number) => {
          return (
            <div className="flex m-auto w-fit" key={i}>
              {row.map((col: TTCMove | null, j: number) => {
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
                    <div className="relative text-4xl">{col?.choice}</div>
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
