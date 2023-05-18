import { RoundHandler } from "../handlers/RoundHandler";
import {
  GameNames,
  MoveChoice,
  TTCPlayer,
  TTCCombination as TTCCombination,
  IUser,
  TTCMove,
  Game,
  TTCState,
  TTCOptions,
  Board,
} from "../../../web/types";
import { PlayerHandler } from "../handlers/usersHandler";

export type TTCBoardMove = MoveChoice<TTCMove>;

export class TicTacToeBoard extends Board<TTCBoardMove> {
  board: TTCBoardMove[][] = [];
  moves: TTCBoardMove[];
  constructor() {
    super();
    this.moves = [];
    this.board = this.generateBoard();
  }
  addMove = (move: TTCBoardMove) => {
    const p = this.board[move.move.coords.x];
    if (!p) return;
    if (isValid(this.board, move.move.coords.x, move.move.coords.y)) {
      p[move.move.coords.y] = move;
      this.moves.push(move);
    }
    return this.board;
  };
  generateBoard = (): TTCBoardMove[][] => {
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
    if (!board) return false;

    if (x < 0 || x > board.length || y < 0 || y > board.length) {
      return false;
    }
    const pos = board[x];
    if (!pos) return false;
    if (pos[y]?.move.choice) {
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
      loser: null,
      isTie: false,
    };

    if (!board) return winner;

    for (let i = 0; i < board.length; i++) {
      if (this.checkLine(board[i])) {
        if (board[i][0]!.id) winner.winner = board[i][0]!.id;
        winner.board = board[i];
      }
      let col = board.map((row) => row[i]).filter((i) => i) as TTCBoardMove[];
      if (this.checkLine(col)) {
        winner.winner = col[0]!.id;
        winner.board = col;
      }
    }

    let diag1 = board.map((row, index) => row[index]) as TTCBoardMove[];

    if (this.checkLine(diag1)) {
      winner.winner = diag1[0]!.id;
      winner.board = diag1;
    }
    let diag2 = board.map(
      (row, index) => row[board.length - index - 1]
    ) as TTCBoardMove[];
    if (this.checkLine(diag2)) {
      winner.winner = diag2[0]!.id;
      winner.board = diag2;
    }

    let isFull = true;
    for (let i = 0; i < board.length; i++) {
      const elem = board[i];
      for (let j = 0; j < elem.length; j++) {
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

  checkLine = (diagonal: TTCBoardMove[]): boolean => {
    if (diagonal.length === 0) return false;
    for (let i = 0; i < diagonal.length; i++) {
      if (diagonal[i]?.move.choice !== diagonal[0]?.move.choice) {
        return false;
      }
    }
    return true;
  };
}

export const { generateBoard, isValid, newBlock, checkBoard, checkLine } =
  new TicTacToeBoard();

export type TTCRound = {
  winner: {
    id: string;
  };
  loser: {
    id: string;
  };
  isTie: boolean;
  moves: TTCBoardMove[];
};

export class TicTacToeGame extends Game {
  name: GameNames = "Tic Tac Toe";
  players: PlayerHandler<TTCPlayer> = new PlayerHandler<TTCPlayer>();
  board: TicTacToeBoard = new TicTacToeBoard();
  rounds: RoundHandler<TTCBoardMove> = new RoundHandler<TTCBoardMove>();

  isPlayerTurn(playerId: string): boolean {
    if (this.board.moves.length == 0) {
      const player = this.players.getPlayers().filter((i) => i.choice == "X");
      if (player.length == 0 || !player[0]) return false;
      return player[0].id == playerId;
    }
    const p = this.board.moves[this.board.moves.length - 1];
    if (!p) return false;
    return p.id !== playerId;
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
  addPlayer(player: IUser) {
    let choice;
    if (this.players.getPlayers().length == 0) {
      choice = Math.random() > 0.5 ? "X" : "O";
    } else if (
      this.players.getPlayers()[0]?.choice == "O" ||
      this.players.getPlayers()[0]?.choice == "X"
    ) {
      choice = this.players.getPlayers()[0]!.choice == "X" ? "O" : "X";
    }

    this.players.addPlayer({
      ...player,
      choice: choice as TTCOptions,
    });
  }
  newRound() {
    if (this.board.moves.length > 0) {
      const winner = this.board.checkBoard(this.board.board);
      this.rounds.addRound({
        winner: {
          id: winner.isTie ? "tie" : winner.winner!,
        },
        isTie: winner.isTie,
        moves: winner.board!,
      });
    }

    this.board.board = this.board.generateBoard();
    this.players.getPlayers().forEach((player) => {
      player.choice = player.choice == "X" ? "O" : "X";
    });
    this.board.moves = [];
    console.log(this.rounds.rounds);
  }
  getPlayers(): TTCPlayer[] {
    return this.players.getPlayers();
  }
  play(player: TTCBoardMove) {
    this.board.addMove(player);
    // console.log(this.board.board);
  }
  hasWinner() {
    return this.board.isValid;
  }

  getState(): TTCState {
    return {
      board: this.board.board,
      currentPlayerTurn: this.playerTurn() as TTCPlayer,
      moves: this.board.moves,
      name: this.name,
      players: this.players.getPlayers(),
      rounds: {
        count: this.rounds.count,
        rounds: this.rounds.rounds,
      },
    };
  }
}
