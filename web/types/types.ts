import { GameNames } from "./game";

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type OmitBy<T, K extends keyof T> = Omit<T, K>;

export type ChildrenType =
  | React.ReactNode
  | React.ReactNode[]
  | JSX.Element
  | JSX.Element[];

export type Badges = {
  totalBadges: number;
  badges: Badge[];
};

export type Badge = {
  id: number;
  name: string;
  description: string;
  created: string;
};

export type Direction = "up" | "down" | "left" | "right";

export type Coords = {
  x: number;
  y: number;
};
