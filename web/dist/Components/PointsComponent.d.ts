import { IUser } from "../../shared/src/types/users";
type Player = Omit<IUser, "created_at" | "email"> & {
    score: number;
};
export declare const PointsComponent: ({ player1, player2, }: {
    player1: Player;
    player2: Player;
}) => JSX.Element;
export {};
//# sourceMappingURL=PointsComponent.d.ts.map