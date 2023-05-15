"use client";
import { useUser } from "@/hooks/useUser";
import { userSocket } from "@/lib/socket";
import { GameInvite, User } from "@/types";
export const GameInviteComponent = ({
  gameInvite,
}: {
  gameInvite: GameInvite;
}) => {
  const handleAccept = () => {
    if (userSocket.connected) {
      userSocket.emit(
        "game_invite_response",
        "accepted",
        gameInvite,
        (data) => {
          console.log(data);
        }
      );
    }
  };
  return (
    <div className="bg-blue-200">
      <div>
        <p>{gameInvite.from.username} invited you to a game!</p>
      </div>
      <div>
        <p>Game: {gameInvite.gameName}</p>
      </div>
      <div className="bg-red-100 flex flex-row justify-between px-12">
        <button onClick={handleAccept}>Accept</button>
        <button>Decline</button>
      </div>
    </div>
  );
};
