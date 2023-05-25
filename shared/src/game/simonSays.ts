import {
  SMSColorType,
  Game,
  GameNames,
  SMSMove,
  SMSRound,
  SMState,
  SMSPlayer,
} from "../types/game";
import { RoundHandler } from "../handlers/RoundHandler";
import { PlayerHandler, uhandler } from "../handlers/usersHandler";

export class SimonSaysGame extends Game<"Simon Says"> {
  name: GameNames = "Simon Says";
  players: PlayerHandler<SMSPlayer>;
  rounds: RoundHandler<SMSRound> = new RoundHandler<SMSRound>();
  sequence: SMSColorType[];
  playerSequence: SMSMove[] = [];
  constructor() {
    super();
    this.sequence = ["blue"];
    this.players = new PlayerHandler();
  }
  get speed() {
    return this.getSpeed(this.rounds.count);
  }
  private getSpeed(roundCount: number) {
    if (roundCount < 5) {
      return 900;
    }
    if (roundCount < 10) {
      return 700;
    }
    if (roundCount < 15) {
      return 500;
    }
    if (roundCount < 20) {
      return 250;
    }
    return 100;
  }
  addPlayer(player: SMSPlayer): void {
    this.players.addPlayer(player);
  }
  play(move: SMSMove): void {
    this.playerSequence.push(move);
  }
  get hasLost() {
    if (this.sequence.length == 0 || this.playerSequence.length == 0)
      return false;
    if (
      this.sequence[this.sequence.length - 1] !==
      this.playerSequence[this.playerSequence.length - 1].color
    ) {
      return true;
    }
    return false;
  }
  sequenceComplete() {
    console.log(this.sequence.length, this.playerSequence.length);
    return this.sequence.length == this.playerSequence.length;
  }
  genRandomSequence(num: number): SMSColorType[] {
    const colors: SMSColorType[] = ["blue", "green", "yellow", "red"];

    const sequence: SMSColorType[] = [];
    for (let i = 0; i < num; i++) {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      sequence.push(randomColor);
    }
    return sequence;
  }
  newRound(): void {
    this.rounds.addRound({
      moves: {
        sequence: this.playerSequence,
      },
      isTie: false,
      winner: {
        id: this.players.getPlayers()[0].id,
      },
    });
    this.sequence.push(this.genRandomSequence(1)[0]);
    this.playerSequence = [];
  }
  getPlayers(): any[] {
    const players = this.players.getPlayers();
    return players.map((i) => {
      return uhandler.getUser(i.id);
    });
  }
  toSequence(sequence: SMSColorType[]): SMSMove[] {
    return sequence.map((i) => ({
      id: this.getPlayers()[0].id,
      color: i,
    }));
  }
  getState(): SMState {
    return {
      name: this.name,
      players: this.getPlayers(),
      rounds: {
        count: this.rounds.count,
        rounds: this.rounds.rounds,
      },
      speed: this.speed,
      sequence: this.sequence,
    };
  }
  isReady(): boolean {
    return true;
  }
}
