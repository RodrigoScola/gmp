"use client";
import { useUser } from "@/hooks/useUser";
import { newSocketAuth, socket } from "@/lib/socket";
import { useEffect, useMemo, useRef, useState } from "react";
import { useUpdateEffect } from "usehooks-ts";
import { SimonGameState, } from "../../../shared/src/types/game";
export const gameId = "a0s9df0a9sdjf";
export const SimonSaysComponent = (props) => {
    const [colors, _] = useState(["blue", "green", "yellow", "red"]);
    const [gamePlayState, setGamePlayState] = useState(SimonGameState.WAITING);
    const [gameState, setGameState] = useState({
        sequence: [],
        name: "Simon Says",
        players: [],
        speed: 1000,
        rounds: {
            count: 0,
            rounds: [],
        },
    });
    const [playerSequence, setPlayerSequence] = useState([]);
    const [round, setRound] = useState(0);
    const [maxRound, setMaxRound] = useState(parseInt(localStorage.getItem("simon_max_score") ?? "1") ?? 0);
    const [refs, __] = useState({
        red: useRef(null),
        blue: useRef(null),
        green: useRef(null),
        yellow: useRef(null),
    });
    const canPlay = useMemo(() => {
        if (gamePlayState == SimonGameState.PLAYING) {
            return true;
        }
        return false;
    }, [gamePlayState]);
    const gameLost = () => {
        setGamePlayState(SimonGameState.END);
    };
    const setMaxScore = (score) => {
        setMaxRound(score);
        localStorage.setItem("simon_max_score", score.toString());
    };
    const addToSequence = (color) => {
        if (!canPlay || !user)
            return;
        socket.emit("sms_move", {
            id: user.id,
            color: color,
        });
        blink(refs[color].current, 1);
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
        const ncolors = gameState.sequence.map((move) => move);
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
            blink(refs[color].current, 1);
        }, gameState.speed);
    }, [gameState.sequence]);
    const blink = (ref, time) => {
        const color = ref.name;
        ref?.classList.add(`simon_${color}_blink`);
        setTimeout(() => {
            ref?.classList.remove(`simon_${color}_blink`);
        }, 100 * time);
    };
    const { user } = useUser();
    useEffect(() => {
        if (!user)
            return;
        socket.auth = newSocketAuth({
            gameName: props.gameName,
            roomId: props.gameId,
            user: user,
        });
        socket.connect();
        socket.emit("join_room", props.gameId);
        socket.on("sms_new_round", (state) => {
            setGameState(state);
            console.log(state);
            setPlayerSequence([]);
        });
        socket.on("sms_game_lost", () => {
            socket.emit("get_state", (state) => {
                console.log(state, "this is the state");
            });
            gameLost();
        });
        socket.on("start_game", () => {
            socket.emit("get_state", (state) => {
                console.log(state, "this is the state2");
                setGameState(state);
            });
        });
        return () => {
            if (socket.connected) {
                socket.disconnect();
            }
        };
    }, []);
    return (<div className="w-fit m-auto mt-12">
               <div className="flex  justify-around pb-10 ">
                    <div>
                         <p className="font-ginto text-xl ">Best Score</p>
                         <p className="text-center font-ginto font-semibold">
                              {maxRound ?? 0}
                         </p>
                    </div>
                    <div>
                         <p className="font-ginto text-xl">Current Score</p>
                         <p className="text-center font-ginto font-semibold">
                              {round ?? 0}
                         </p>
                    </div>
               </div>
               <div className="grid grid-cols-2 gap-4 w-fit m-auto">
                    {colors.map((color) => {
            return (<button 
            // disabled={!canPlay}
            key={`button_${color}`} name={color} ref={refs[color]} onClick={() => addToSequence(color)} className={`simon_${color} simon_button h-40 w-40`}></button>);
        })}
               </div>
               <div className="flex justify-center pt-12 self-center">
                    {(gamePlayState == SimonGameState.END ||
            gamePlayState == SimonGameState.PLAYING) && (<button className="button bg-red text-2xl" onClick={() => startGame()}>
                              Restart
                         </button>)}
                    {gamePlayState == SimonGameState.WAITING && (<button className="button text-2xl px-4 font-whitney font-semibold bg-green" onClick={() => {
                startGame();
            }}>
                              Start
                         </button>)}
               </div>
          </div>);
};
