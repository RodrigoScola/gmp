"use client";
import { useMemo, useRef, useState } from "react";
import { useUpdateEffect } from "usehooks-ts";
import { SimonGameState, } from "../../../../../shared/src/types/game";
const genRandomSequence = (num) => {
    const colors = ["blue", "green", "yellow", "red"];
    const sequence = [];
    for (let i = 0; i < num; i++) {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        sequence.push(randomColor);
    }
    return sequence;
};
const getSpeed = (round) => {
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
    const [localStorage] = useState(typeof window !== "undefined" ? window.localStorage : null);
    const [gameState, setGameState] = useState(SimonGameState.WAITING);
    const [sequence, setSequence] = useState(genRandomSequence(2));
    const [playerSequence, setPlayerSequence] = useState([]);
    const [round, setRound] = useState(0);
    const [maxRound, setMaxRound] = useState(parseInt(localStorage?.getItem("simon_max_score") ?? "1") ?? 0);
    const [refs, __] = useState({
        red: useRef(null),
        blue: useRef(null),
        green: useRef(null),
        yellow: useRef(null),
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
    const setMaxScore = (score) => {
        setMaxRound(score);
        localStorage?.setItem("simon_max_score", score.toString());
    };
    const addToSequence = (color) => {
        if (!canPlay)
            return;
        blink(refs[color].current, 1);
        setPlayerSequence([...playerSequence, color]);
    };
    const startGame = () => {
        setGameState(SimonGameState.START);
        setSequence(genRandomSequence(1));
        setRound(0);
        setPlayerSequence([]);
    };
    useUpdateEffect(() => {
        if (playerSequence[playerSequence.length - 1] ==
            sequence[playerSequence.length - 1]) {
            console.log("same");
        }
        else {
            gameLost();
        }
        if (playerSequence.length == sequence.length) {
            setPlayerSequence([]);
            setSequence([...sequence, ...genRandomSequence(1)]);
        }
    }, [playerSequence]);
    useUpdateEffect(() => {
        const ncolors = [...sequence];
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
            blink(refs[color].current, 1);
        }, getSpeed(round));
    }, [sequence]);
    const blink = (ref, time) => {
        const color = ref.name;
        ref?.classList.add(`simon_${color}_blink`);
        setTimeout(() => {
            ref?.classList.remove(`simon_${color}_blink`);
        }, 100 * time);
    };
    return (<div className="w-fit m-auto">
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
            return (<button disabled={!canPlay} key={`button_${color}`} name={color} ref={refs[color]} onClick={() => addToSequence(color)} className={`simon_${color} h-40 w-40`}></button>);
        })}
      </div>
      <div className="flex justify-center pt-12 self-center">
        {(gameState == SimonGameState.END ||
            gameState == SimonGameState.PLAYING) && (<button onClick={() => startGame()}>Restart</button>)}
        {gameState == SimonGameState.WAITING && (<button onClick={() => {
                startGame();
            }}>
            Start
          </button>)}
      </div>
    </div>);
}
