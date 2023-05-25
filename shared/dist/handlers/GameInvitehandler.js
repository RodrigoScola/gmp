"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameInviteHandler = void 0;
class GameInviteHandler {
    // private toInvites: Map<string, string>;
    // private frominvites: Map<string, string>;
    constructor() {
        this.invites = new Map();
    }
    addInvite(from, to, gameName) {
        const inviteId = Date.now().toString();
        const gameInvite = {
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
    removeInvite() { }
    acceptInvite(inviteId) {
        let invite = this.invites.get(inviteId);
        if (!invite)
            return;
        invite.state = "accepted";
        return invite;
    }
    declineInvite(inviteId) {
        let invite = this.invites.get(inviteId);
        if (!invite)
            return;
        invite.state = "declined";
        return invite;
    }
    hasInvite(inviteId) {
        return this.invites.has(inviteId);
    }
}
exports.GameInviteHandler = GameInviteHandler;
