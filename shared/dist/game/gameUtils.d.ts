import { GameNames } from "../types/game";
export type GameData = {
    name: GameNames;
    description: string;
    id: number;
    isMultiplayer: boolean;
    playerCount: number;
};
export declare const games: Record<number, GameData>;
export declare const getGameData: (gameIdOrName: GameNames | number) => GameData;
