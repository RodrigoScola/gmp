"use client";

import { GameNames, gameNames } from "../../../shared/src/types/game";
import { useState } from "react";
import { Button, Card, CardHeader, Heading, Tooltip } from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import { GameData, getGameData } from "@/../shared/src/game/gameUtils";
import { FriendsList } from "@/Components/Friends/FriendsComponents";
import { useUser } from "@/hooks/useUser";
import { useEffectOnce } from "usehooks-ts";
import { baseUrl } from "@/constants";

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
          <div className="grid grid-cols-7">
               <div className="px-3 col-span-6 text-white">
                    <div>
                         <Heading className="text-3xl text-center py-12">
                              Multiplayer Games
                         </Heading>
                         <div className="grid grid-cols-3 gap-2 max-w-3xl m-auto text-black">
                              {gameNames.map((gameName) => {
                                   const data = getGameData(gameName);
                                   if (data.isMultiplayer === false)
                                        return null;
                                   return (
                                        <GameCard
                                             key={gameName}
                                             game={data}
                                             toggleGame={toggleMultiplayerGame}
                                             isSelected={multiplayerGames.includes(
                                                  data
                                             )}
                                        />
                                   );
                              })}
                         </div>
                         <div className="flex justify-center pt-4 ">
                              <Button
                                   onClick={sendSearch}
                                   disabled={multiplayerGames.length == 0}
                                   size={"lg"}
                                   isDisabled={multiplayerGames.length == 0}
                              >
                                   Search
                              </Button>
                         </div>
                    </div>
                    <div>
                         <Heading className="text-3xl text-center py-12">
                              Single Player Games
                         </Heading>
                         <div className="grid grid-cols-1 gap-2 max-w-3xl m-auto text-black">
                              {gameNames.map((gameName) => {
                                   const data = getGameData(gameName);
                                   if (data.isMultiplayer === true) return null;
                                   return (
                                        <GameCard
                                             key={gameName}
                                             isSelected={singlePlayerGames.includes(
                                                  data
                                             )}
                                             game={data}
                                             toggleGame={toggleSinglePlayerGame}
                                        />
                                   );
                              })}
                         </div>
                         <div className="flex justify-center pt-4 ">
                              <Button
                                   onClick={sendSearch}
                                   disabled={singlePlayerGames.length == 0}
                                   size={"lg"}
                                   isDisabled={singlePlayerGames.length == 0}
                              >
                                   play
                              </Button>
                         </div>
                    </div>
               </div>
               <div>
                    <FriendsList friends={user.friends} />
               </div>
          </div>
     );
}

type gameCardProps = {
     game: GameData;
     toggleGame: (game: GameNames) => void;
     isSelected: boolean;
};
const GameCard = ({ game, isSelected, toggleGame }: gameCardProps) => {
     return (
          <>
               <Card
                    key={game.name}
                    backgroundColor={isSelected ? "lightblue" : "gray"}
                    onClick={() => toggleGame(game.name)}
                    textColor={isSelected ? "black" : "white"}
                    variant={isSelected ? "filled" : "outline"}
                    className={` `}
               >
                    <CardHeader className="flex align-middle text-center items-center gap-1">
                         <Heading as="h3" className=" capitalize text-center">
                              {game.name}
                         </Heading>
                         <Tooltip label={game.description}>
                              <div>
                                   <InfoIcon />
                              </div>
                         </Tooltip>
                    </CardHeader>
               </Card>
          </>
     );
};
