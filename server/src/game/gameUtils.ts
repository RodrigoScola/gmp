import { GameNames } from "../../../web/types/game";

export const games: Record<
  number,
  { id: number; name: GameNames; playerCount: number; isMultiplayer: boolean }
> = {
  0: { id: 0, name: "connect Four", playerCount: 2, isMultiplayer: true },
  1: { id: 1, name: "Tic Tac Toe", playerCount: 2, isMultiplayer: true },
  2: {
    id: 2,
    name: "Rock Paper Scissors",
    playerCount: 2,
    isMultiplayer: true,
  },
  3: { id: 3, name: "Simon Says", playerCount: 1, isMultiplayer: false },
};
export const getGameData = (gameIdOrName: GameNames | number) => {
  if (typeof gameIdOrName === "number") {
    const game = games[gameIdOrName];
    if (game) return game;
    else throw new Error("Game not found");
  } else {
    const game = Object.values(games).find(
      (game) => game.name === gameIdOrName
    );
    if (game) return game;
    else throw new Error("Game not found");
  }
};
