import {
  Coords,
  Game,
  MoveChoice,
  GameNames,
  CFState,
  User,
  ConnectChoices,
} from "../../../web/types";
import { PlayerHandler } from "../handlers/usersHandler";
import { RoundHandler, RoundType } from "../handlers/RoundHandler";
export abstract class Board<T> {
  abstract generateBoard(): void;
  abstract board: T[][];
  abstract moves: T[];
  abstract addMove(move: T): void;
  abstract isValid(board: T[][], x: number, y: number): void;
}

export type CFMove = {
  color: ConnectChoices;
  coords: Coords;
};
export type CFBoardMove = MoveChoice<CFMove>;
export class CFBoard extends Board<CFBoardMove> {
  board: CFBoardMove[][];
  moves: CFBoardMove[] = [];
  rows: number = 6;
  cols: number = 7;

  constructor() {
    super();
    this.board = this.generateBoard();
  }

  generateBoard(): CFBoardMove[][] {
    let rows: CFBoardMove[][] = [];
    for (let i = 0; i < this.rows; i++) {
      rows[i] = new Array(this.cols).fill({
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
  addMove(move: MoveChoice<CFMove>): void {
    if (!this.isValid(this.board, move.move.coords.x, move.move.coords.y))
      return;
    for (let i = this.rows - 1; i >= 0; i--) {
      const board = this.board;

      const pos = board[i];
      if (!pos) continue;
      if (!pos[move.move.coords.x]?.id) {
        const nmove = {
          id: move.id,
          move: {
            color: move.move.color,
            coords: {
              x: move.move.coords.x,
              y: i,
            },
          },
        };
        pos[move.move.coords.x] = nmove;
        this.moves.push(nmove);
        // console.log(this.board);
        break;
      }
    }

    // console.log(this.board);
  }
  checkBoard(): boolean {
    for (let j = 0; j < this.rows; j++) {
      for (let i = 0; i <= this.cols - 4; i++) {
        const test = this.board[j][i];
        if (test.id) {
          let temp = true;
          for (let k = 0; k < 4; k++) {
            if (this.board[j][i + k]?.id !== test.id) {
              temp = false;
            }
          }
          if (temp == true) {
            return true;
          }
        }
      }
    }
    for (let j = 0; j <= this.rows - 4; j++) {
      for (let i = 0; i < this.cols; i++) {
        const test = this.board[j][i];
        if (test.id) {
          let temp = true;
          for (let k = 0; k < 4; k++) {
            if (this.board[j + k][i]?.id !== test.id) {
              temp = false;
            }
          }
          if (temp == true) {
            return true;
          }
        }
      }

      for (let i = 0; i <= this.cols - 4; i++) {
        const test = this.board[j][i];
        if (test.id) {
          let temp = true;
          for (let k = 0; k < 4; k++) {
            if (this.board[j + k][i + k]?.id !== test.id) {
              temp = false;
            }
          }
          if (temp == true) {
            return true;
          }
        }
      }

      for (let i = 3; i <= this.cols; i++) {
        const test = this.board[j][i];
        if (!test) continue;
        if (test.id) {
          let temp = true;
          for (let k = 0; k < 4; k++) {
            if (this.board[j + k][i - k]?.id !== test.id) {
              return true;
            }
          }
          if (temp == true) {
            return true;
          }
        }
      }
    }

    return false;
  }

  isTie() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (!this.board[i][j].id) return false;
      }
    }
    return true;
  }
  isValid(board: CFBoardMove[][], x: number, y: number): boolean {
    if (!board) return false;
    if (x < 0 || x > board[0].length || y < 0 || y > board.length) {
      return false;
    }
    if (board[x][y].id) return false;

    return true;
  }
}

export type CFplayer = {
  id: string;
  choice: ConnectChoices;
};

export type CFRound = {};
export class CFGame implements Game {
  name: GameNames = "connect Four";
  board: CFBoard;
  round: RoundHandler<CFRound> = new RoundHandler();
  moves: CFBoardMove[] = [];
  players: PlayerHandler<CFplayer> = new PlayerHandler<CFplayer>();

  addPlayer(player: User) {
    const choice = this.players.getPlayers().length == 1 ? "red" : "blue";
    this.players.addPlayer({
      id: player.id,
      choice,
    });
  }
  getPlayers(): CFplayer[] {
    return this.players.getPlayers();
  }
  isReady() {
    return this.getPlayers().length == 2;
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
  newRound(): void {
    this.round.addRound({
      winner: {
        id: "",
      },
      moves: [this.moves],
      isTie: false,
    });
  }

  isPlayerTurn(playerId: string): boolean {
    if (this.moves.length == 0) {
      return this.players.getPlayers()[0].id == playerId;
    }
    return this.moves[this.moves.length - 1].id !== playerId;
  }
  playerTurn() {
    if (this.board.moves.length == 0) {
      return this.players.getPlayers().find((i) => i.choice == "blue");
    }
    return this.board.moves[this.board.moves.length - 1];
  }
  getWinner(): RoundType<CFRound> | null {
    const hasWin = this.board.checkBoard();

    if (!hasWin) return null;
    const winner = this.moves[this.moves.length - 1];

    return {
      isTie: this.board.isTie(),
      moves: this.moves,
      winner: winner,
    };
  }
  play(move: MoveChoice<CFMove>): void {
    // console.log(this.moves);
    this.board.addMove(move);
    this.moves.push(move);
  }
}
export const { generateBoard } = new CFBoard();
