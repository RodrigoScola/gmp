import { RoundHandler } from "./rockpaperScissors";
import {
  GameNames,
  MoveChoice,
  TTCPlayer,
  TicTacToeOptions,
  TTCCombination as TTCCombination,
  User,
  TTCMove,
  Game,
  TTCOptions,
  TTCState,
} from "../../../web/types";
import { PlayerHandler } from "../handlers/usersHandler";
import { Board } from "./c4Game";

export type TTCBoardMove = MoveChoice<TTCMove>;

export class TicTacToeBoard implements Board<TTCBTTCBoardMove> {
  board: TTCBTTCBoardMove[][];
  moves: TTCBoardMove[];
  constructor() {
    this.moves = [];
    this.board = this.generateboard();
  }
  addMove = (move: TTCBoardMove) => {
    if (isValid(this.board, move.move.coords.x, move.move.coords.y)) {
      this.board[move.move.coords.x][move.move.coords.y] = move;
      this.moves.push(move);
    }

    return this.board;
  };
  generateboard = (): TTCBoardMove[][] => {
    let rows: TTCBoardMove[][] = [];
    for (let i = 0; i < 3; i++) {
      rows[i] = new Array(3).fill({
        id: "",
        move: {
          choice: null,
          coords: {
            x: 0,
            y: 0,
          },
        },
      });
    }
    return rows;
  };
  isValid = (
    board: TTCBoardMove[][],
    x: number = -1,
    y: number = -1
  ): boolean => {
    if (x < 0 || x > board.length || y < 0 || y > board.length) {
      return false;
    }
    if (board[x][y]?.move.choice) {
      return false;
    }
    if (this.checkBoard(board).winner) return false;
    return true;
  };
  newBlock = (params: MoveChoice<TTCMove>): MoveChoice<TTCMove> => {
    return {
      id: params.id,
      move: {
        choice: params.move?.choice,
        coords: {
          x: params.move?.coords.x,
          y: params.move?.coords.y,
        },
      },
    };
  };

  checkBoard = (board: TTCBoardMove[][]): TTCCombination => {
    let winner: TTCCombination = {
      winner: null,
      board: null,
      isTie: false,
    };
    for (let i = 0; i < board.length; i++) {
      if (this.checkLine(board[i])) {
        winner.winner = board[i][0]?.id;
        winner.board = board[i];
      }
      let col = board.map((row) => row[i]);
      if (this.checkLine(col)) {
        winner.winner = col[0]?.id;
        winner.board = col;
      }
    }

    let diag1 = board.map((row, index) => row[index]);

    if (this.checkLine(diag1)) {
      winner.winner = diag1[0]?.id;
      winner.board = diag1;
    }
    let diag2 = board.map((row, index) => row[board.length - index - 1]);
    if (this.checkLine(diag2)) {
      winner.winner = diag2[0]?.id;
      winner.board = diag2;
    }

    let isFull = true;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (!board[i][j].move.choice) {
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

  private checkLine = (diagonal: TTCBoardMove[]): boolean => {
    if (diagonal.length === 0) return false;
    for (let i = 0; i < diagonal.length; i++) {
      if (diagonal[i]?.move.choice !== diagonal[0]?.move.choice) {
        return false;
      }
    }
    return true;
  };
}

export const { generateboard, isValid, newBlock, checkBoard, checkLine } =
  new TicTacToeBoard();

export class TicTacToeGame extends Game {
  name: GameNames = "Tic Tac Toe";
  players: PlayerHandler<TTCPlayer> = new PlayerHandler<TTCPlayer>();
  board: TicTacToeBoard = new TicTacToeBoard();
  rounds: RoundHandler<TTCBoardMove> = new RoundHandler<TTCBoardMove>();

  isPlayerTurn(playerId: string): boolean {
    if (this.board.moves.length == 0) {
      return this.players.getPlayers().find((i) => i.choice == "X");
    }
    return this.board.moves[this.board.moves.length - 1].id !== playerId;
  }
  playerTurn() {
    if (this.board.moves.length == 0) {
      return this.players.getPlayers().find((i) => i.choice == "X");
    }
    return this.board.moves[this.board.moves.length - 1];
  }
  isReady(): boolean {
    return true;
  }
  addPlayer(player: User) {
    let choice;
    if (this.players.getPlayers().length == 0) {
      choice = Math.random() > 0.5 ? "X" : "O";
    } else if (
      this.players.getPlayers()[0]?.choice == "O" ||
      this.players.getPlayers()[0]?.choice == "X"
    ) {
      choice = this.players.getPlayers()[0].choice == "X" ? "O" : "X";
    }

    this.players.addPlayer({
      ...player,
      choice,
    });
  }
  nextRound() {
    if (this.board.moves.length > 0) {
      this.rounds.addRound(this.board.moves);
    }

    this.board.board = generateboard();
    this.players.getPlayers().forEach((player) => {
      player.choice = player.choice == "X" ? "O" : "X";
    });
    this.board.moves = [];

    console.log(this.rounds.rounds);
  }
  getPlayers(): TTCPlayer[] {
    return this.players.getPlayers();
  }
  play(player: TTCBoardMove, choice: TTCBoardMove["move"]) {
    this.board.addMove(player);
    // console.log(this.board.board);
  }
  hasWinner() {
    return this.board.isValid;
  }

  getState(): TTCState {
    return {
      board: this.board.board,
      currentPlayerTurn: this.playerTurn(),
      moves: this.board.moves,
      name: this.name,
      players: this.players.getPlayers(),
      rounds: this.rounds.rounds,
    };
  }
}
