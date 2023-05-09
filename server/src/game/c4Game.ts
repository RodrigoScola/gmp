import {
  Coords,
  Game,
  MoveChoice,
  GameNames,
  CFState,
} from "../../../web/types";
import { PlayerHandler } from "../handlers/usersHandler";
export abstract class Board<T> {
  abstract generateBoard(): void;
  abstract board: T[][];
  abstract moves: T[];
  abstract addMove(): void;
  abstract isValid(): void;
  abstract checkBoard(): void;
  abstract checkLine(): void;
}

export type CFMove = {
  color: number[];
  coords: Coords;
};
export type CFBoardMove = MoveChoice<CFMove>;
export class CFBoard extends Board<CFBoardMove> {
  board: CFBoardMove[][];
  moves: CFBoardMove[] = [];
  constructor() {
    super();
    this.board = this.generateBoard();
  }

  generateBoard(): CFBoardMove[][] {
    let rows: CFBoardMove[][] = [];
    for (let i = 0; i < 6; i++) {
      rows[i] = new Array(7).fill({
        id: "",
        move: {
          color: [0, 0, 0],
          coords: {
            x: 0,
            y: 0,
          },
        },
      });
    }
    return rows;
  }
  addMove(): void {}
  checkBoard(): boolean {
    return true;
  }
  checkLine(): void {}
  isValid(): void {}
}

export type CFplayer = {
  id: string;
};

export class CFGame implements Game {
  name: GameNames = "connect Four";
  board: CFBoard;

  players: PlayerHandler<CFplayer> = new PlayerHandler<CFplayer>();

  addPlayer(player: string) {
    this.players.addPlayer({
      id: player,
    });
  }
  getPlayers(): CFplayer[] {
    return this.players.getPlayers();
  }
  isReady() {
    return true;
  }
  constructor() {
    this.board = new CFBoard();
  }
  getState(): CFState {
    return {
      board: this.board.board,
      currentPlayerTurn: this.players.getPlayers()[0],
      moves: this.board.moves,
      name: this.name,
      players: this.players.getPlayers(),
      rounds: {
        count: 0,
        rounds: [],
      },
    };
  }
  newRound(): void {}
  play(): void {}
}
