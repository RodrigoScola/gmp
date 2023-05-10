export type RoundType<T> = {
  winner: {
    id: string;
  };
  isTie: boolean;
  moves: T[];
};

export class RoundHandler<T> {
  count: number = 0;
  maxWins: number = 5;
  rounds: RoundType<T>[];

  constructor() {
    this.rounds = [];
  }

  addRound(round: RoundType<T>) {
    this.rounds.push(round);
    this.count++;
  }
  countWins(playerId: string) {
    return this.rounds.filter(
      (i) => i.winner.id == playerId && i.isTie == false
    ).length;
  }
  isWinner(playerId: string) {
    return this.countWins(playerId) >= this.maxWins;
  }
  hasGameWinner() {
    let players: Record<string, number> = {};
    if (this.rounds.length == 0) return 0;
    for (let i = 0; i < this.rounds.length; i++) {
      const round = this.rounds[i];
      if (!round) continue;
      if (!round?.isTie) {
        if (players[round.winner.id]) {
          players[round.winner.id]++;
        } else {
          players[round.winner.id] = 1;
        }
      }
    }
    if (Object.keys(players).length == 0) return false;
    const winner = Object.values(players).filter((i) => i >= this.maxWins)[0];
    return winner;
  }
  getWinner() {
    const winner = this.hasGameWinner();
    if (!winner) return null;
    return Object.entries((s: [string, number]) => s[1] == winner)[0];
  }
}
