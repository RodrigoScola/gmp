import { GameNames } from "../../../web/types";

export const games: Record<number, { id: number; name: GameNames }> = {
  0: { id: 0, name: "connect Four" },
  1: { id: 1, name: "Tic Tac Toe" },
  2: { id: 2, name: "Rock Paper Scissors" },
  3: { id: 3, name: "Simon Says" },
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
