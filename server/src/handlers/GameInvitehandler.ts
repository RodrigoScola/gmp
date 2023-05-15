import { GameInvite, GameNames, User } from "../../../web/types";
import { getGame } from "./Handlers";
import { GameRoom, roomHandler } from "./room";
import { uhandler } from "./usersHandler";
export class GameInviteHandler {
  invites: Map<string, GameInvite>;
  // private toInvites: Map<string, string>;
  // private frominvites: Map<string, string>;

  constructor() {
    this.invites = new Map<string, GameInvite>();
  }
  addInvite(from: User, to: User, gameName: GameNames): undefined | GameInvite {
    const inviteId = Date.now().toString();
    const gameInvite: GameInvite = {
      gameName: gameName,
      roomId: "a0s9df0a9sdjf",
      from: from,
      inviteId,
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
