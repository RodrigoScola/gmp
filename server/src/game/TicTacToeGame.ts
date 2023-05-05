import { RoundHandler } from "./rockpaperScissors";
import {
  GameNames,
  MoveChoice,
  TicTacToeOptions,
  TicTacToeCombination as TicTacToeCombination,
  User,
  TicTacToeMove,
} from "../../../web/types";
import { Game } from "../handlers/GameHandler";
import { PlayerHandler } from "../handlers/usersHandler";

export class TicTacToeBoard {
  board: TicTacToeMove[][];

  constructor() {
    this.board = this.generateboard();
  }

  generateboard = (): TicTacToeMove[][] => {
    let rows: TicTacToeMove[][] = [];
    for (let i = 0; i < 3; i++) {
      rows[i] = new Array(3).fill({
        userId: null,
        moveId: Date.now().toString(),
        coords: {
          x: 0,
          y: 0,
        },
        type: null,
      });
    }
    return rows;
  };
  isValid = (
    board: TicTacToeMove[][],
    x: number = -1,
    y: number = -1
  ): boolean => {
    if (x < 0 || x > board.length || y < 0 || y > board.length) {
      return false;
    }
    if (board[x][y]?.type) {
      return false;
    }
    if (this.checkBoard(board).winner) return false;
    return true;
  };
  newBlock = ({
    coords,
    type,
    userId,
  }: Partial<TicTacToeMove>): TicTacToeMove => {
    return {
      coords: {
        x: coords?.x ?? 0,
        y: coords?.y ?? 0,
      },
      moveId: Date.now().toString(),
      userId: userId ?? baseUser.id,
      type: type || "O",
    };
  };

  checkBoard = (board: TicTacToeMove[][]): TicTacToeCombination => {
    let winner: TicTacToeCombination = {
      winner: null,
      board: null,
      isTie: false,
    };
    for (let i = 0; i < board.length; i++) {
      if (this.checkLine(board[i])) {
        winner.winner = board[i][0]?.userId;
        winner.board = board[i];
      }
      let col = board.map((row) => row[i]);
      if (this.checkLine(col)) {
        winner.winner = col[0]?.userId;
        winner.board = col;
      }
    }

    let diag1 = board.map((row, index) => row[index]);

    if (this.checkLine(diag1)) {
      winner.winner = diag1[0]?.userId;
      winner.board = diag1;
    }
    let diag2 = board.map((row, index) => row[board.length - index - 1]);
    if (this.checkLine(diag2)) {
      winner.winner = diag2[0]?.userId;
      winner.board = diag2;
    }

    let isFull = true;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (!board[i][j].type) {
          isFull = false;
        }
      }
    }
    if (isFull == true && !winner.winner) {
      winner.isTie = true;
      winner.winner = "tie";
    }
    return winner;
  };

  private checkLine = (diagonal: TicTacToeMove[]): boolean => {
    if (diagonal.length === 0) return false;
    for (let i = 0; i < diagonal.length; i++) {
      if (diagonal[i]?.type !== diagonal[0]?.type) {
        return false;
      }
    }
    return true;
  };
}

export const { generateboard, isValid, newBlock, checkBoard, checkLine } =
  new TicTacToeBoard();

export class TicTacToeGame implements Game {
  name: GameNames = "Tic Tac Toe";
  players: PlayerHandler = new PlayerHandler();
  board: TicTacToeBoard = new TicTacToeBoard();
  rounds: RoundHandler = new RoundHandler<TicTacToeMove>();

  isReady(): boolean {
    return true;
  }
  addPlayer(player: User) {
    this.players.addPlayer(player);
  }

  getPlayers(): User[] {
    return this.players.getPlayers();
  }
  hasGameWinner(): User | null {
    return null;
  }
  isPLayerTurn(player: User): boolean {
    return this.rounds.lastRound()?.id == player.id;
  }
  play<T extends TicTacToeMove, K extends T["choice"]>(
    choice: T,
    move: K
  ): void {
    console.log(choice, move);
  }
  hasWinner() {
    return this.board.isValid;
  }
}
