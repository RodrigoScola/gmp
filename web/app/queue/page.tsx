"use client";

import { Card, Text, Heading } from "@chakra-ui/react";
import { getGameData } from "@/../server/src/game/gameUtils";
import { useUser } from "@/hooks/useUser";
import { queueSocket } from "@/lib/socket";
import { GameType } from "@/types/game";
import { useEffect, useState } from "react";
import { FriendsList } from "@/Components/Friends/FriendsComponents";

export default function QueueHoldingPage({
  searchParams,
}: {
  searchParams: any;
}) {
  const { user, friends: userFriends, getFriends } = useUser();

  useEffect(() => {
    getFriends();
  }, []);

  const [gameName, _] = useState<GameType[]>(
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
        // queueSocket.emit("get_state", (data) => {});
      }, 10000);
      setTimer(timerId);
    }
  }, []);

  useEffect(() => {
    if (queueSocket.connected) return;
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
    <div
      className="flex flex-row
    "
    >
      <div className="m-auto pt-12 w-fit">
        <Heading>Currently Finding a Game</Heading>
        <ul className="grid-flow-col py-10 grid">
          {gameName.map((gameData, index) => {
            return (
              <Card className="w-fit p-6 " key={index}>
                <Text>{gameData.name}</Text>
              </Card>
            );
          })}
        </ul>
        <div className="pb-6 text-center">
          <Text className="text-xl">
            You have been waiting for <span>12 minutes</span>
          </Text>
        </div>
        <div className="text-center text-2xl">
          Currently there are <span>0</span> people in queue.
        </div>
      </div>
      <div>
        <FriendsList friends={userFriends} />
      </div>
    </div>
  );
}
