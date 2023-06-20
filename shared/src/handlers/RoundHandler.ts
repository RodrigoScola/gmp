import {
     CFRound,
     RPSRound,
     RoundType,
     SMSRound,
     TTCRound,
} from "../types/game";

export class RoundHandler<T extends RPSRound | TTCRound | SMSRound | CFRound> {
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
               (i) => i!.winner?.id == playerId && i.isTie == false
          ).length;
     }
     isWinner(playerId: string) {
          return this.countWins(playerId) >= this.maxWins;
     }
     hasGameWinner(): string | null {
          let players: Record<string, number> = {};
          if (this.rounds.length == 0) return null;
          for (let i = 0; i < this.rounds.length; i++) {
               const round = this.rounds[i];
               if (!round) continue;
               if (!round?.isTie) {
                    const winner = round.winner;
                    if (!winner) continue;
                    if (players[winner.id]) {
                         players[winner.id]++;
                    } else {
                         players[winner.id] = 1;
                    }
               }
          }
          if (Object.keys(players).length == 0) return null;
          const winner = Object.entries(players).find(
               (a) => a[1] >= this.maxWins
          );

          if (winner) {
               return winner[0];
          }
          return null;
     }
     getWinner() {
          const winner = this.hasGameWinner();
          if (!winner) return null;
          return winner;
     }
}
