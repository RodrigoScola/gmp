"use client";

import { GameQueueState } from "@/../shared/src/types/socketEvents";

import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useUser } from "@/hooks/useUser";
import { queueSocket } from "@/lib/socket";
import { Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useEffectOnce, useInterval } from "usehooks-ts";
import { getGameData } from "../../../../shared/src/game/gameUtils";
import { GameType } from "../../../../shared/src/types/game";

import GameCard from "@/Components/GameCard";
export default function QueueHoldingPage({
     searchParams,
}: {
     searchParams: any;
}) {
     useProtectedRoute();
     const { user } = useUser();
     const [queueState, setQueueState] = useState<GameQueueState>({
          length: 1,
     });

     const [games, setGames] = useState<GameType[]>(
          searchParams.games
               ? searchParams.games
                      .split(",")
                      .map((gameId: GameType) => getGameData(Number(gameId)))
               : []
     );
     useEffectOnce(() => {
          const querystring = window.location.search;
          const urlParams = new URLSearchParams(querystring);
          const gameIds = urlParams.get("games");
          if (gameIds) {
               const gameData = gameIds
                    .split(",")
                    .map((gameId) => getGameData(Number(gameId)));
               setGames(gameData);
          }
     });
     const [timer, setTimer] = useState<NodeJS.Timer | undefined>(undefined);

     useEffect(() => {
          if (timer) {
               clearInterval(timer);
          } else {
               const timerId = setInterval(() => {
                    queueSocket.emit("get_state", (data) => {
                         setQueueState(data);
                    });
               }, 3000);
               setTimer(timerId);
          }
     }, []);

     useEffect(() => {
          if (queueSocket.connected) return;
          queueSocket.auth = {
               user: user,
          };
          queueSocket.connect();

          queueSocket.emit("join_queue", games);
          queueSocket.on("game_found", (data) => {
               window.location.href = `/play/${data.gameId}/?gamename=${data.gameName}`;
          });
          return () => {
               if (queueSocket.connected) {
                    queueSocket.disconnect();
               }
          };
     }, [games]);

     const [waitingTime, setWaitingTime] = useState<number>(0);
     useInterval(() => {
          setWaitingTime((curr) => curr + 1);
     }, 1000);
     return (
          <div className="m-auto mt-2 shadow-sm p-6 w-fit bg-gray-600 rounded-lg">
               <h3 className="text-4xl text-center font-ginto font-semibold">
                    Finding a Game
               </h3>
               <ul className="grid-flow-col justify-evenly gap-3 py-10 grid">
                    {games.map((GameType) => {
                         const gameData = getGameData(GameType.name);
                         return (
                              <GameCard
                                   key={GameType.name}
                                   className="w-fit  p-2"
                                   game={gameData}
                                   isSelected={false}
                              />
                         );
                    })}
               </ul>
               <div className="pb-6 text-center">
                    <Text className="text-xl">
                         You have been waiting for{" "}
                         <span>{waitingTime} seconds</span>
                    </Text>
               </div>
               <div className="text-center text-2xl">
                    Currently there are <span>{queueState.length}</span> people
                    in queue.
               </div>
          </div>
     );
}
