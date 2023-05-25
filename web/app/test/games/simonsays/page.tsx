"use client";
import { useMemo, useRef, useState } from "react";
import { useUpdateEffect } from "usehooks-ts";
import {
  SMSColorType as ColorType,
  SimonGameState,
} from "../../../../../shared/src/types/game";
type ColorRefs = {
  red: React.RefObject<HTMLButtonElement | null>;
  blue: React.RefObject<HTMLButtonElement | null>;
  green: React.RefObject<HTMLButtonElement | null>;
  yellow: React.RefObject<HTMLButtonElement | null>;
};
const genRandomSequence = (num: number): ColorType[] => {
  const colors: ColorType[] = ["blue", "green", "yellow", "red"];

  const sequence: ColorType[] = [];
  for (let i = 0; i < num; i++) {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    sequence.push(randomColor);
  }
  return sequence;
};

const getSpeed = (round: number) => {
  if (round < 5) {
    return 900;
  }
  if (round < 10) {
    return 700;
  }
  if (round < 15) {
    return 500;
  }
  if (round < 20) {
    return 250;
  }
  return 100;
};

export default function SimonSaysPAGE() {
  const [colors, _] = useState(["blue", "green", "yellow", "red"]);
  const [localStorage] = useState(
    typeof window !== "undefined" ? window.localStorage : null
  );
  const [gameState, setGameState] = useState<SimonGameState>(
    SimonGameState.WAITING
  );
  const [sequence, setSequence] = useState<ColorType[]>(genRandomSequence(2));
  const [playerSequence, setPlayerSequence] = useState<string[]>([]);
  const [round, setRound] = useState<number>(0);
  const [maxRound, setMaxRound] = useState<number>(
    parseInt(localStorage?.getItem("simon_max_score") ?? ("1" as string)) ?? 0
  );

  const [refs, __] = useState<ColorRefs>({
    red: useRef<HTMLButtonElement | null>(null),
    blue: useRef<HTMLButtonElement | null>(null),
    green: useRef<HTMLButtonElement | null>(null),
    yellow: useRef<HTMLButtonElement | null>(null),
  });
  const canPlay = useMemo(() => {
    if (gameState == SimonGameState.PLAYING) {
      return true;
    }
    return false;
  }, [gameState]);
  const gameLost = () => {
    setGameState(SimonGameState.END);
  };

  const setMaxScore = (score: number) => {
    setMaxRound(score);
    localStorage?.setItem("simon_max_score", score.toString());
  };

  const addToSequence = (color: ColorType) => {
    if (!canPlay) return;
    blink(refs[color].current as HTMLButtonElement, 1);
    setPlayerSequence([...playerSequence, color]);
  };
  const startGame = () => {
    setGameState(SimonGameState.START);
    setSequence(genRandomSequence(1));
    setRound(0);
    setPlayerSequence([]);
  };

  useUpdateEffect(() => {
    if (
      playerSequence[playerSequence.length - 1] ==
      sequence[playerSequence.length - 1]
    ) {
      console.log("same");
    } else {
      gameLost();
    }
    if (playerSequence.length == sequence.length) {
      setPlayerSequence([]);
      setSequence([...sequence, ...genRandomSequence(1)]);
    }
  }, [playerSequence]);

  useUpdateEffect(() => {
    const ncolors: ColorType[] = [...sequence];
    setGameState(SimonGameState.WAITING);
    const intervaliId = setInterval(() => {
      const color = ncolors.shift();
      if (!color) {
        clearInterval(intervaliId);
        setGameState(SimonGameState.PLAYING);
        setRound((curr) => curr + 1);
        if (round > maxRound) {
          setMaxScore(round);
        }
        return;
      }
      blink(refs[color].current as HTMLButtonElement, 1);
    }, getSpeed(round));
  }, [sequence]);

  const blink = (ref: HTMLButtonElement, time: number) => {
    const color = ref.name;
    ref?.classList.add(`simon_${color}_blink`);
    setTimeout(() => {
      ref?.classList.remove(`simon_${color}_blink`);
    }, 100 * time);
  };
  return (
    <div className="w-fit m-auto">
      <div className="flex  justify-around pb-10 ">
        <div>
          <p>best score</p>
          <p className="text-center">{maxRound ?? 0}</p>
        </div>
        <div>
          <p>current score</p>
          <p className="text-center">{round ?? 0}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 w-fit m-auto">
        {colors.map((color) => {
          return (
            <button
              disabled={!canPlay}
              key={`button_${color}`}
              name={color}
              ref={
                refs[
                  color as keyof ColorRefs
                ] as React.RefObject<HTMLButtonElement>
              }
              onClick={() => addToSequence(color as ColorType)}
              className={`simon_${color} h-40 w-40`}
            ></button>
          );
        })}
      </div>
      <div className="flex justify-center pt-12 self-center">
        {(gameState == SimonGameState.END ||
          gameState == SimonGameState.PLAYING) && (
          <button onClick={() => startGame()}>Restart</button>
        )}
        {gameState == SimonGameState.WAITING && (
          <button
            onClick={() => {
              startGame();
            }}
          >
            Start
          </button>
        )}
      </div>
    </div>
  );
}
