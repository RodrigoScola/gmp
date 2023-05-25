import { GameNames } from "../types/game";
import { GameInvite, IUser } from "../types/users";
export declare class GameInviteHandler {
    invites: Map<string, GameInvite>;
    constructor();
    addInvite(from: IUser, to: IUser, gameName: GameNames): undefined | GameInvite;
    removeInvite(): void;
    acceptInvite(inviteId: string): GameInvite | undefined;
    declineInvite(inviteId: string): GameInvite | undefined;
    hasInvite(inviteId: string): boolean;
}
