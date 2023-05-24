"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ColorType,
  GameComponentProps,
  MoveChoice,
  SMSMove,
  SMSState,
  SimonGameState,
} from "@/types/game";
import { useUpdateEffect } from "usehooks-ts";
import { newSocketAuth, socket } from "@/lib/socket";
import { useUser } from "@/hooks/useUser";

type ColorRefs = {
  red: React.RefObject<HTMLButtonElement | null>;
  blue: React.RefObject<HTMLButtonElement | null>;
  green: React.RefObject<HTMLButtonElement | null>;
  yellow: React.RefObject<HTMLButtonElement | null>;
};
export const gameId = "a0s9df0a9sdjf";

export const SimonSaysComponent = (props: GameComponentProps) => {
  const [colors, _] = useState(["blue", "green", "yellow", "red"]);
  const [gamePlayState, setGamePlayState] = useState<SimonGameState>(
    SimonGameState.WAITING
  );
  const [gameState, setGameState] = useState<SMSState>({
    sequence: [],
    name: "Simon Says",
    players: [],
    speed: 1000,
    rounds: {
      count: 0,
      rounds: [],
    },
  });
  const [playerSequence, setPlayerSequence] = useState<MoveChoice<SMSMove>[]>(
    []
  );
  const [round, setRound] = useState<number>(0);
  const [maxRound, setMaxRound] = useState<number>(
    parseInt(localStorage.getItem("simon_max_score") ?? ("1" as string)) ?? 0
  );

  const [refs, __] = useState<ColorRefs>({
    red: useRef<HTMLButtonElement | null>(null),
    blue: useRef<HTMLButtonElement | null>(null),
    green: useRef<HTMLButtonElement | null>(null),
    yellow: useRef<HTMLButtonElement | null>(null),
  });
  const canPlay = useMemo(() => {
    if (gamePlayState == SimonGameState.PLAYING) {
      return true;
    }
    return false;
  }, [gamePlayState]);
  const gameLost = () => {
    console.log("you lost");
    setGamePlayState(SimonGameState.END);
  };

  const setMaxScore = (score: number) => {
    setMaxRound(score);
    localStorage.setItem("simon_max_score", score.toString());
  };

  const addToSequence = (color: ColorType) => {
    if (!canPlay) return;
    socket.emit("sms_move", {
      id: user.id,
      color: color,
    });

    blink(refs[color].current as HTMLButtonElement, 1);
    setPlayerSequence([
      ...playerSequence,
      {
        id: user.id,
        color: color,
      },
    ]);
  };
  const startGame = () => {
    socket.emit("player_ready");
    setGamePlayState(SimonGameState.START);
    setRound(0);
    setPlayerSequence([]);
  };

  useUpdateEffect(() => {
    const ncolors: ColorType[] = gameState.sequence.map(
      (move) => move.move.color
    );
    console.log(ncolors);
    const intervaliId = setInterval(() => {
      const color = ncolors.shift();
      if (!color) {
        clearInterval(intervaliId);
        setGamePlayState(SimonGameState.PLAYING);
        setRound((curr) => curr + 1);
        if (round > maxRound) {
          setMaxScore(round);
        }
        return;
      }
      blink(refs[color].current as HTMLButtonElement, 1);
    }, gameState.speed);
  }, [gameState.sequence]);

  const blink = (ref: HTMLButtonElement, time: number) => {
    const color = ref.name;
    ref?.classList.add(`simon_${color}_blink`);
    setTimeout(() => {
      ref?.classList.remove(`simon_${color}_blink`);
    }, 100 * time);
  };
  const { user } = useUser();
  useEffect(() => {
    socket.auth = newSocketAuth({
      gameName: props.gameName,
      roomId: props.gameId,
      user: user,
    });
    socket.connect();
    socket.emit("join_room", props.gameId);
    socket.on("sms_new_round", (state: SMSState) => {
      setGameState(state);
      setPlayerSequence([]);
    });
    socket.on("sms_game_lost", () => {
      gameLost();
    });
    socket.on("start_game", () => {
      socket.emit("get_state", (state: SMSState) => {
        console.log(state);
        setGameState(state);
      });
    });
    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, []);

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
              ref={refs[color as keyof ColorRefs]}
              onClick={() => addToSequence(color as ColorType)}
              className={`simon_${color} h-40 w-40`}
            ></button>
          );
        })}
      </div>
      <div className="flex justify-center pt-12 self-center">
        {(gamePlayState == SimonGameState.END ||
          gamePlayState == SimonGameState.PLAYING) && (
          <button onClick={() => startGame()}>Restart</button>
        )}
        {gamePlayState == SimonGameState.WAITING && (
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
};
