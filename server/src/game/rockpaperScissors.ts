import { PlayerHandler, usersHandlers } from "../handlers/usersHandler";
import { Game } from "@/../server/dist/handlers/GameHandler";
import {
  RPSPlayer,
  RPSWinCombination,
  User,
  MoveChoice,
  RPSRound,
  RPSOptions,
  GameNames,
} from "../../../web/types";
export const RockPaperScissorsMaxWins = 5;

export class RoundHandler<T> {
  count: number = 0;
  maxWins: number = RockPaperScissorsMaxWins;
  rounds: T[];

  constructor() {
    this.rounds = [];
  }

  addRound(round: RPSRound) {
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
    if (this.rounds.length == 0) return false;
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
    const winner = Object.keys(players).find((i) => players[i] >= this.maxWins);
    return winner;
  }
}

export class RockPaperScissorsGame implements Game {
  name: GameNames = "Rock Paper Scissors";
  players: PlayerHandler = new PlayerHandler();
  currentChoice: Record<string, MoveChoice> = {};
  rounds: RoundHandler = new RoundHandler();
  play(player: RPSPlayer, choice: RPSOptions) {
    if (this.rounds.hasGameWinner()) return;
    console.log(player, choice);
    console.log(player, choice);
    console.log(player, choice);
    if (this.currentChoice[player.id] || !this.players.hasPlayer(player.id))
      return;
    this.currentChoice[player.id] = {
      ...player,
      choice: choice,
    };
    console.log(this.currentChoice);
    return;
  }
  addPlayer(player: User) {
    this.players.addPlayer(player);
  }
  isReady(): boolean {
    return this.getPlayers().length == 2;
  }
  getPlayers(): User[] {
    return this.players.getPlayers();
  }
  hasRoundWinner() {
    const [player1, player2] = this.getPlayers();

    if (!player1 || !player2) return null;

    const player1Choice = this.currentChoice[player1.id];
    const player2Choice = this.currentChoice[player2.id];
    if (!player1Choice || !player2Choice) return null;
    return this.getWinner(
      { ...player1, choice: player1Choice.choice },
      { ...player2, choice: player2Choice.choice }
    );
  }
  isRoundWinner(player: RPSPlayer) {
    return this.hasRoundWinner()?.id == player.id;
  }

  getOpponents(player: RPSPlayer) {
    return Object.values(this.currentChoice).filter((i) => i.id != player.id);
  }
  isTie() {
    return Object.values(this.currentChoice).every((i) => i.choice);
  }
  isRoundWinner(player: RPSPlayer) {
    return this.hasRoundWinner()?.id == player.id;
  }

  getWinnerCombination = (opt1: RPSOptions, opt2: RPSOptions): RPSOptions => {
    const combination = RPSWinCombination.find((combination) => {
      return (
        (combination.winner == opt1 && combination.loser == opt2) ||
        (combination.winner == opt2 && combination.loser == opt1)
      );
    });
    if (combination) {
      return combination.winner;
    }
    return opt1;
  };
  getWinner = (player1: RPSPlayer, player2: RPSPlayer): RPSRound | null => {
    if (!player1 || !player2) return null;
    if (player1.choice == null || player2.choice == null) return null;
    if (player1.choice == player2.choice) {
      return {
        isTie: true,
        loser: player1,
        winner: player2,
      };
    }
    if (
      this.getWinnerCombination(player1.choice, player2.choice) ==
      player1.choice
    ) {
      return {
        isTie: false,
        loser: player2,
        winner: player1,
      };
    }
    return {
      isTie: false,
      loser: player1,
      winner: player2,
    };
  };
  newRound() {
    const roundWinner = this.hasRoundWinner();
    if (!roundWinner) return;
    this.rounds.addRound(roundWinner);
    this.currentChoice = {};
  }
  hasGameWinner() {
    const players = this.getPlayers();
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      if (!player) continue;
      if (this.isGameWinner(player.id)) {
        return player;
      }
    }
    return null;
  }

  isGameWinner(playerId: string) {
    return this.rounds.isWinner(playerId);
  }

  getWinner = (player1: RPSPlayer, player2: RPSPlayer): RPSRound | null => {
    if (!player1 || !player2) return null;
    if (player1.choice == null || player2.choice == null) return null;
    if (player1.choice == player2.choice) {
      return {
        isTie: true,
        loser: player1,
        winner: player2,
      };
    }
    if (
      this.getWinnerCombination(player1.choice, player2.choice) ==
      player1.choice
    ) {
      return {
        isTie: false,
        loser: player2,
        winner: player1,
      };
    }
    return {
      isTie: false,
      loser: player1,
      winner: player2,
    };
  };

  newRound() {
    const roundWinner = this.hasRoundWinner();
    if (!roundWinner) return;
    this.rounds.addRound(roundWinner);
    this.currentChoice = {};
  }
  hasGameWin() {
    const players = this.getPlayers();
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      if (!player) continue;
      if (this.isGameWinner(player.id)) {
        return player;
      }
    }
    return null;
  }
  isGameWinner(playerId: string) {
    return this.rounds.isWinner(playerId);
  }
}
