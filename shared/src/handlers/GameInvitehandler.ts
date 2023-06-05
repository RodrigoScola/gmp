import { randomUUID } from "crypto";
import { GameNames } from "../types/game";
import { GameInvite, IUser } from "../types/users";

export class GameInviteHandler {
     invites: Map<string, GameInvite>;
     // private toInvites: Map<string, string>;
     // private frominvites: Map<string, string>;

     constructor() {
          this.invites = new Map<string, GameInvite>();
     }
     addInvite(
          from: IUser,
          to: IUser,
          gameName: GameNames
     ): undefined | GameInvite {
          const inviteId = Date.now().toString();
          const gameInvite: GameInvite = {
               gameName: gameName,
<<<<<<< HEAD
               roomId: randomUUID(),
               from: from,
               inviteId,
=======
               roomId: "a0s9df0a9sdjf",
               from: from,
               inviteId: randomUUID(),
>>>>>>> 8e02ec11482aa4e4c7e27cd19ffd90ea7c3d049a
               to: to,
               state: "pending",
          };
          this.invites.set(inviteId, gameInvite);
          return gameInvite;
     }
     removeInvite() {}
     acceptInvite(inviteId: string): GameInvite | undefined {
          let invite = this.invites.get(inviteId);
          if (!invite) return;
          invite.state = "accepted";

          return invite;
     }
     declineInvite(inviteId: string): GameInvite | undefined {
          let invite = this.invites.get(inviteId);
          if (!invite) return;
          invite.state = "declined";
          return invite;
     }
     hasInvite(inviteId: string) {
          return this.invites.has(inviteId);
     }
}
