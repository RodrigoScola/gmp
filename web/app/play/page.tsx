"use client";

import { GameData, getGameData } from "@/../shared/src/game/gameUtils";
import { FriendsTab } from "@/Components/tabs/FriendsTab";
import { baseUrl } from "@/constants";
import { HTMLAttributes, useState } from "react";
import { useEffectOnce } from "usehooks-ts";
import { GameNames, gameNames } from "../../../shared/src/types/game";
import { useUser } from "../../hooks/useUser";

export default function PLAYPAGE() {
     const [multiplayerGames, setMultiplayergames] = useState<GameData[]>([]);
     const user = useUser();
     useEffectOnce(() => {
          user.getFriends();
     });
     const [singlePlayerGames, setSinglePlayerGames] = useState<GameData[]>([]);
     const sendSearch = () => {
          window.location.href = `${baseUrl}/queue/?games=${multiplayerGames
               .concat(singlePlayerGames)
               .map((g) => g.id)
               .join(",")}`;
     };

     const toggleSinglePlayerGame = (GameName: GameNames) => {
          const game = getGameData(GameName);
          if (
               singlePlayerGames.some(
                    (currentGame) => currentGame.id === game.id
               )
          ) {
               setSinglePlayerGames((curr) =>
                    curr.filter((currentGame) => currentGame.id !== game.id)
               );
               return;
          }
          setSinglePlayerGames((curr) => [...curr, game]);
     };
     const toggleMultiplayerGame = (GameName: GameNames) => {
          const game = getGameData(GameName);
          if (
               multiplayerGames.some(
                    (currentGame) => currentGame.id === game.id
               )
          ) {
               setMultiplayergames((curr) =>
                    curr.filter((currentGame) => currentGame.id !== game.id)
               );
               return;
          }
          setMultiplayergames((curr) => [...curr, game]);
     };
     return (
          <div className="flex flex-row">
               <div className="w-full m-auto text-white">
                    <div className="w-fit m-auto h-fit">
                         <div className="w-fit h-fit  m-auto">
                              <h3 className="text-3xl font-ginto font-bold  py-12">
                                   Multiplayer Games
                              </h3>
                              <div className="w-fit gap-2 m-auto flex flex-row">
                                   {gameNames.map((gameName) => {
                                        const data = getGameData(gameName);
                                        if (data.isMultiplayer === false)
                                             return null;
                                        return (
                                             <GameCard
                                                  key={gameName}
                                                  game={data}
                                                  onClick={() =>
                                                       toggleMultiplayerGame(
                                                            gameName
                                                       )
                                                  }
                                                  isSelected={multiplayerGames.includes(
                                                       data
                                                  )}
                                             />
                                        );
                                   })}
                              </div>
                              <div className="flex justify-center pt-4 ">
                                   <button
                                        onClick={sendSearch}
                                        disabled={
                                             multiplayerGames.length == 0 ||
                                             singlePlayerGames.length !== 0
                                        }
                                        className="disabled:bg-gray-900/60 disabled:text-gray-300 text-2xl  button transition-all duration-100 bg-white text-gray-700 p-2 px-12 rounded-md"
                                   >
                                        Search
                                   </button>
                              </div>
                         </div>
                         <div className="w-full m-auto">
                              <p className="text-3xl font-ginto font-bold py-12">
                                   Single Player Games
                              </p>
                              <div className=" gap-2   m-auto text-black">
                                   {gameNames.map((gameName) => {
                                        const data = getGameData(gameName);
                                        if (data.isMultiplayer === true)
                                             return null;
                                        return (
                                             <GameCard
                                                  key={gameName}
                                                  isSelected={singlePlayerGames.includes(
                                                       data
                                                  )}
                                                  game={data}
                                                  onClick={() =>
                                                       toggleSinglePlayerGame(
                                                            gameName
                                                       )
                                                  }
                                             />
                                        );
                                   })}
                              </div>
                              <div className="flex justify-center pt-4 ">
                                   <button
                                        onClick={sendSearch}
                                        disabled={
                                             singlePlayerGames.length == 0 ||
                                             multiplayerGames.length !== 0
                                        }
                                        className="disabled:bg-gray-900/60 disabled:text-gray-300 text-2xl  button transition-all duration-100 bg-white text-gray-700 p-2 px-12 rounded-md"
                                   >
                                        Play
                                   </button>
                              </div>
                         </div>
                    </div>
               </div>
               <div>
                    <FriendsTab friends={user.friends} />
               </div>
          </div>
     );
}

type gameCardProps = {
     game: GameData;
     isSelected: boolean;
};
export const GameCard = ({
     game,
     isSelected,
     ...props
}: gameCardProps & HTMLAttributes<HTMLDivElement>) => {
     return (
          <>
               <div
                    {...props}
                    key={game.name}
                    className={`${
                         isSelected ? "bg-blue shadow-lg" : "bg-gray-700"
                    } rounded-lg  max-w-[300px] p-2 ${
                         props.className
                    } border-2 border-white`}
               >
                    <div className=" align-middle items-center gap-1 pb-2">
                         <h3 className="text-white font-whitney font-semibold text-4xl capitalize ">
                              {game.name}
                         </h3>
                         <div className="font-thin text-white font-whitney text-left">
                              {game.description}
                         </div>
                    </div>
               </div>
          </>
     );
};
