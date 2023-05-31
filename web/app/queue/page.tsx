"use client";

import { Card, Text, Heading } from "@chakra-ui/react";
import { getGameData } from "../../../shared/src/game/gameUtils";
import { useUser } from "@/hooks/useUser";
import { queueSocket } from "@/lib/socket";
import { GameType } from "../../../shared/src/types/game";
import { useEffect, useState } from "react";
import { FriendsList } from "@/Components/Friends/FriendsComponents";
import { useEffectOnce, useInterval } from "usehooks-ts";
import { GameQueueState } from "@/../shared/src/types/socketEvents";

export default function QueueHoldingPage({
     searchParams,
}: {
     searchParams: any;
}) {
     const { user, friends: userFriends, getFriends } = useUser();
     const [queueState, setQueueState] = useState<GameQueueState>({
          length: 1,
     });
     useEffect(() => {
          getFriends();
     }, []);

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
          queueSocket.on("game_found", (data: any) => {
               window.location.href = `/play/${data}`;
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
          <div
               className="flex flex-row
    "
          >
               <div className="m-auto pt-12 w-fit">
                    <Heading>Currently Finding a Game</Heading>
                    <ul className="grid-flow-col py-10 grid">
                         {games.map((gameData, index) => {
                              return (
                                   <Card className="w-fit p-6 " key={index}>
                                        <Text>{gameData.name}</Text>
                                   </Card>
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
                         Currently there are <span>{queueState.length}</span>{" "}
                         people in queue.
                    </div>
               </div>
               <div>
                    <FriendsList friends={userFriends} />
               </div>
          </div>
     );
}
