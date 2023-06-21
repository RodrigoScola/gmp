"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameInviteHandler = void 0;
const crypto_1 = require("crypto");
class GameInviteHandler {
    // private toInvites: Map<string, string>;
    // private frominvites: Map<string, string>;
    constructor() {
        this.invites = new Map();
    }
    addInvite(from, to, gameName) {
        const inviteId = (0, crypto_1.randomUUID)();
        const gameInvite = {
            gameName: gameName,
            roomId: (0, crypto_1.randomUUID)(),
            from: from,
            inviteId: inviteId,
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
