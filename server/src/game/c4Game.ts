import { TTCBoardMove, TicTacToeBoard } from "./TicTacToeGame";
import { Game, GameNames, User } from "../../../web/types";
import { PlayerHandler } from "../handlers/usersHandler";
export abstract class Board<T> {
  abstract generateBoard(): void;
  board: T[][];
  abstract addMove(): void;
  abstract isValid(): void;
  abstract checkBoard(): void;
  abstract checkLine(): void;
}
export class CFBoard extends Board<TTCBoardMove> {
  board: TTCBoardMove[][];

  generateBoard(numbs: number): void {}
  addMove(): void {}
  checkBoard(): void {}
  checkLine(): void {}
  isValid(): void {}
}

export class CFGame extends Game {
  name: GameNames = "connect Four";
  board: CFBoard;
  getPlayers: <T>() => T[];

  isReady: () => boolean;
  players: PlayerHandler<{
    id: string;
    color: string;
  }> = new PlayerHandler();

  newRound(): void {}
  play(): void {}
  constructor() {
    this.board = new CFBoard();
  }
}
