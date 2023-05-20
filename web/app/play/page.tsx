"use client";

import { getGameData } from "../../../server/src/game/gameUtils";
import { GameNames, GameType, gameNames } from "@/types/types";
import { useState } from "react";

const cardClassName =
  " rounded-md outline-2 text-2xl  outline-slate-200 outline  py-5 flex justify-center ";

export default function PLAYPAGE() {
  const [multiplayerGames, setMultiplayergames] = useState<GameType[]>([]);
  const [singlePlayerGames, setSinglePlayerGames] = useState<GameType[]>([]);
  const sendSearch = () => {
    window.location.href = `queue/?games=${multiplayerGames
      .concat(singlePlayerGames)
      .map((g) => g.id)
      .join(",")}`;
  };

  const toggleSinglePlayerGame = (GameName: GameNames) => {
    const game = getGameData(GameName);
    if (singlePlayerGames.some((currentGame) => currentGame.id === game.id)) {
      setSinglePlayerGames((curr) =>
        curr.filter((currentGame) => currentGame.id !== game.id)
      );
      return;
    }
    setSinglePlayerGames((curr) => [...curr, game]);
  };
  const toggleMultiplayerGame = (GameName: GameNames) => {
    const game = getGameData(GameName);
    if (multiplayerGames.some((currentGame) => currentGame.id === game.id)) {
      setMultiplayergames((curr) =>
        curr.filter((currentGame) => currentGame.id !== game.id)
      );
      return;
    }
    setMultiplayergames((curr) => [...curr, game]);
  };
  return (
    <div className="px-3">
      <div>
        <h3 className="text-3xl text-center py-12">Multiplayer Games</h3>
        <div className="grid grid-cols-2 gap-2 max-w-3xl m-auto text-black">
          {gameNames.map((gameName) => {
            const data = getGameData(gameName);
            if (data.isMultiplayer === false) return null;
            return (
              <div
                key={gameName}
                onClick={() => toggleMultiplayerGame(gameName)}
                className={`${cardClassName} ${
                  !multiplayerGames.includes(data)
                    ? "bg-slate-200"
                    : "bg-blue-700"
                }`}
              >
                <h3>{gameName}</h3>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center pt-4 ">
          <button
            onClick={sendSearch}
            disabled={multiplayerGames.length == 0}
            className="outline-green-300 outline disabled:text-slate-700 disabled:outline-slate-700  text-green-300 w-48 h-20 text-3xl py-2 px-7 rounded-md"
          >
            Search
          </button>
        </div>
      </div>
      <div>
        <h3 className="text-3xl text-center py-12">Single Player Games</h3>
        <div className="grid grid-cols-2 gap-2 max-w-3xl m-auto text-black">
          {gameNames.map((gameName) => {
            const data = getGameData(gameName);
            if (data.isMultiplayer === true) return null;
            return (
              <div
                key={gameName}
                onClick={() => toggleSinglePlayerGame(gameName)}
                className={`${cardClassName} ${
                  !singlePlayerGames.includes(data)
                    ? "bg-slate-200"
                    : "bg-blue-700"
                }`}
              >
                <h3>{gameName}</h3>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center pt-4 ">
          <button
            onClick={sendSearch}
            disabled={singlePlayerGames.length == 0}
            className="outline-green-300 outline disabled:text-slate-700 disabled:outline-slate-700  text-green-300 w-48 h-20 text-3xl py-2 px-7 rounded-md"
          >
            Play
          </button>
        </div>
      </div>
    </div>
  );
}
