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
            return null;
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
            return null;
        const winner = Object.entries(players).find((a) => a[1] >= this.maxWins);
        if (winner) {
            return winner[0];
        }
        return null;
    }
    getWinner() {
        const winner = this.hasGameWinner();
        if (!winner)
            return null;
        return winner;
    }
}
exports.RoundHandler = RoundHandler;
