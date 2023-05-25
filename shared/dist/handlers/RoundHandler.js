"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoundHandler = void 0;
class RoundHandler {
    constructor() {
        this.count = 0;
        this.maxWins = 5;
        this.rounds = [];
    }
    addRound(round) {
        this.rounds.push(round);
        this.count++;
    }
    countWins(playerId) {
        return this.rounds.filter((i) => { var _a; return ((_a = i.winner) === null || _a === void 0 ? void 0 : _a.id) == playerId && i.isTie == false; }).length;
    }
    isWinner(playerId) {
        return this.countWins(playerId) >= this.maxWins;
    }
    hasGameWinner() {
        let players = {};
        if (this.rounds.length == 0)
            return 0;
        for (let i = 0; i < this.rounds.length; i++) {
            const round = this.rounds[i];
            if (!round)
                continue;
            if (!(round === null || round === void 0 ? void 0 : round.isTie)) {
                const winner = round.winner;
                if (!winner)
                    continue;
                if (players[winner.id]) {
                    players[winner.id]++;
                }
                else {
                    players[winner.id] = 1;
                }
            }
        }
        if (Object.keys(players).length == 0)
            return false;
        const winner = Object.values(players).filter((i) => i >= this.maxWins)[0];
        return winner;
    }
    getWinner() {
        const winner = this.hasGameWinner();
        if (!winner)
            return null;
        return Object.entries((s) => s[1] == winner)[0];
    }
}
exports.RoundHandler = RoundHandler;
