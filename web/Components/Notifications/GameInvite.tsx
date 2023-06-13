"use client";
import { userSocket } from "@/lib/socket";
import { GameInvite } from "../../../shared/src/types/users";
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
          <div className="bg-gray-800 rounded-md p-4">
               <div className="text-xl">
                    <p>
                         <span className="font-whitney font-semibold">
                              {gameInvite.from.username}
                         </span>{" "}
                         invited you to{" "}
                         <span className="font-whitney font-bold">
                              {gameInvite.gameName}
                         </span>
                         !
                    </p>
               </div>
               <div className="py-2">
                    <p className="font-whitney">Game: {gameInvite.gameName}</p>
               </div>
               <div className="bg-red-100 flex flex-row gap-5 justify-between ">
                    <button
                         className="button w-full bg-green"
                         onClick={handleAccept}
                    >
                         Accept
                    </button>
                    <button className="button w-full bg-red">Decline</button>
               </div>
          </div>
     );
};
