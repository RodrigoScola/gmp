"use client";
import { getGameData } from "@/../shared/src/game/gameUtils";
import { baseUrl } from "@/constants";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useEffectOnce } from "usehooks-ts";
import { gameNames } from "../../../shared/src/types/game";
import { useUser } from "../../hooks/useUser";
const FriendsTab = dynamic(() => import("@/Components/tabs/FriendsTab").then((r) => r.FriendsTab), {
    loading: () => (<div className="bg-gray-800 rounded-md p-4">loading...</div>),
});
const GameCard = dynamic(() => import("@/Components/GameCard"));
export default function PLAYPAGE() {
    const [multiplayerGames, setMultiplayergames] = useState([]);
    const user = useUser();
    useEffectOnce(() => {
        user.getFriends();
    });
    const [singlePlayerGames, setSinglePlayerGames] = useState([]);
    const sendSearch = () => {
        window.location.href = `${baseUrl}/queue/?games=${multiplayerGames
            .concat(singlePlayerGames)
            .map((g) => g.id)
            .join(",")}`;
    };
    const toggleSinglePlayerGame = (GameName) => {
        const game = getGameData(GameName);
        if (singlePlayerGames.some((currentGame) => currentGame.id === game.id)) {
            setSinglePlayerGames((curr) => curr.filter((currentGame) => currentGame.id !== game.id));
            return;
        }
        setSinglePlayerGames((curr) => [...curr, game]);
    };
    const toggleMultiplayerGame = (GameName) => {
        const game = getGameData(GameName);
        if (multiplayerGames.some((currentGame) => currentGame.id === game.id)) {
            setMultiplayergames((curr) => curr.filter((currentGame) => currentGame.id !== game.id));
            return;
        }
        setMultiplayergames((curr) => [...curr, game]);
    };
    return (<div className="flex flex-row">
               <div className="w-full  m-auto text-white">
                    <div className="w-fit  m-auto h-fit">
                         <div className="w-fit  h-fit my-12  rounded-lg  m-auto">
                              <h3 className="text-3xl font-ginto font-bold  ">
                                   Multiplayer Games
                              </h3>
                              <div className="w-fit p-6 bg-gray-500 rounded-md shadow-md mt-6 gap-2 m-auto flex flex-row">
                                   {gameNames.map((gameName) => {
            const data = getGameData(gameName);
            if (data.isMultiplayer === false)
                return null;
            return (<div key={gameName} onClick={() => toggleMultiplayerGame(gameName)}>
                                                  <GameCard game={data} isSelected={multiplayerGames.includes(data)}/>
                                             </div>);
        })}
                              </div>
                              <div className="flex justify-center pt-4 ">
                                   <button onClick={sendSearch} disabled={multiplayerGames.length == 0 ||
            singlePlayerGames.length !== 0} className="disabled:bg-gray-900/60 disabled:text-gray-300 text-2xl  button transition-all duration-100 bg-white text-gray-700 p-2 px-12 rounded-md">
                                        Search
                                   </button>
                              </div>
                         </div>
                         <div className="w-full m-auto my-12  ">
                              <p className="text-3xl font-ginto pb-6 font-bold ">
                                   Single Player Games
                              </p>
                              <div className=" gap-2 bg-gray-500 p-6 rounded-md shadow-lg   m-auto text-black">
                                   {gameNames.map((gameName) => {
            const data = getGameData(gameName);
            if (data.isMultiplayer === true)
                return null;
            return (<div key={gameName} onClick={() => toggleSinglePlayerGame(gameName)}>
                                                  <GameCard isSelected={singlePlayerGames.includes(data)} game={data}/>
                                             </div>);
        })}
                              </div>
                              <div className="flex justify-center pt-4 ">
                                   <button onClick={sendSearch} disabled={singlePlayerGames.length == 0 ||
            multiplayerGames.length !== 0} className="disabled:bg-gray-900/60 disabled:text-gray-300 text-2xl  button transition-all duration-100 bg-white text-gray-700 p-2 px-12 rounded-md">
                                        Play
                                   </button>
                              </div>
                         </div>
                    </div>
               </div>
               <div>
                    <FriendsTab friends={user.friends}/>
               </div>
          </div>);
}
