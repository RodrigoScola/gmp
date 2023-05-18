"use client";

import { getGameData } from "@/../server/src/game/gameUtils";
import { useUser } from "@/hooks/useUser";
import { queueSocket } from "@/lib/socket";
import { GameType } from "@/types";
import { useEffect, useState } from "react";
import { useEffectOnce } from "usehooks-ts";

export default function QueueHoldingPage({ searchParams }) {
  const { user } = useUser();
  const [gameName, setGameNames] = useState<GameType[]>(
    searchParams.games
      .split(",")
      .map((game: GameType) => getGameData(Number(game)))
  );
  const [timer, setTimer] = useState<NodeJS.Timer | undefined>(undefined);

  useEffect(() => {
    if (timer) {
      clearInterval(timer);
    } else {
      const timerId = setInterval(() => {
        queueSocket.emit("get_state", (data) => {});
      }, 10000);
      setTimer(timerId);
    }
  }, []);

  useEffect(() => {
    queueSocket.auth = {
      user: user,
    };
    queueSocket.connect();
    queueSocket.emit("join_queue", gameName);

    queueSocket.on("game_found", (data) => {
      window.location.href = `/play/${data}`;
    });
    return () => {
      if (queueSocket.connected) {
        queueSocket.disconnect();
      }
    };
  }, []);
  return (
    <>
      <div>currently finding a game</div>
      <div>
        <p>in queue for</p>
        <ul>
          {gameName.map((gameData, index) => {
            return (
              <div key={index}>
                <p>{gameData.name}</p>
              </div>
            );
          })}
        </ul>
      </div>
      <div>
        waiting for
        <div>12 minutes</div>
      </div>
      <div>currently theres 0 people in queue</div>
    </>
  );
}
