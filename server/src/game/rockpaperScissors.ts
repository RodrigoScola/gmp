import { PlayerHandler } from "../handlers/usersHandler";
import {
  RPSPlayer,
  RPSWinCombination,
  RPSRound,
  Game,
  RPSOptions,
  GameNames,
  RPSMove,
  RPSstate,
} from "../../../web/types/game";
import { IUser } from "../../../web/types/users";
import { RoundHandler } from "../handlers/RoundHandler";
export const RockPaperScissorsMaxWins = 5;

export class RockPaperScissorsGame extends Game<"Rock Paper Scissors"> {
  name: GameNames = "Rock Paper Scissors";
  players: PlayerHandler<RPSPlayer>;
  currentChoice: Record<string, RPSMove> = {};
  rounds: RoundHandler<RPSRound>;
  constructor() {
    super();
    this.rounds = new RoundHandler<RPSRound>();
    this.players = new PlayerHandler<RPSPlayer>();
  }
  play(player: RPSPlayer, choice: RPSOptions) {
    if (this.rounds.hasGameWinner()) return;
    if (this.currentChoice[player.id] || !this.players.hasPlayer(player.id))
      return;
    this.currentChoice[player.id] = {
      id: player.id,
      choice: choice,
    };
    return;
  }
  addPlayer(player: IUser) {
    this.players.addPlayer(player);
  }
  isReady(): boolean {
    return this.getPlayers().length == 2;
  }
  getPlayers(): IUser[] {
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
    return this.hasRoundWinner()?.winner.id == player.id;
  }

  getOpponents(player: RPSPlayer) {
    return Object.values(this.currentChoice).filter((i) => i.id != player.id);
  }
  isTie() {
    return Object.values(this.currentChoice).every((i) => i.choice);
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
    const player1Move: RPSMove = {
      id: player1.id,
      choice: player1.choice,
    };
    const player2Move: RPSMove = {
      id: player2.id,
      choice: player2.choice,
    };
    if (player1.choice == player2.choice) {
      return {
        isTie: true,
        loser: player1,
        winner: player2,
        moves: [player1Move, player2Move],
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
        moves: [player1Move, player2Move],
      };
    }
    return {
      isTie: false,
      loser: player1,
      winner: player2,
      moves: [player1Move, player2Move],
    };
  };
  newRound() {
    const roundWinner = this.hasRoundWinner();
    if (!roundWinner) return;
    this.rounds.addRound({
      isTie: roundWinner.isTie,
      moves: roundWinner,
      winner: {
        id: roundWinner.winner.id,
      },
    });
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
  getState(): RPSstate {
    return {
      moves: Object.values(this.currentChoice),
      name: this.name,
      players: this.getPlayers(),
      rounds: {
        count: this.rounds.count,
        rounds: this.rounds.rounds,
      },
    };
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
}
