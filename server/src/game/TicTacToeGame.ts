import { RoundHandler } from "../handlers/RoundHandler";
import {
  GameNames,
  TTCPlayer,
  TTCMove,
  Game,
  TTCState,
  TTCOptions,
  Board,
  GameInfo,
  TTCCombination,
} from "../../../web/types/game";
import { PlayerHandler } from "../handlers/usersHandler";

export class TicTacToeBoard extends Board<TTCMove> {
  board: TTCMove[][] = [];
  moves: TTCMove[];
  constructor() {
    super();
    this.moves = [];
    this.board = this.generateBoard();
  }
  addMove = (move: TTCMove) => {
    const p = this.board[move.coords.x];
    if (!p) return;
    if (isValid(this.board, move.coords.x, move.coords.y)) {
      p[move.coords.y] = move;
      this.moves.push(move);
    }
    return this.board;
  };
  generateBoard = (): TTCMove[][] => {
    let rows: TTCMove[][] = [];
    for (let i = 0; i < 3; i++) {
      rows[i] = new Array(3).fill({
        id: "",
        choice: null,
        coords: {
          x: 0,
          y: 0,
        },
      });
    }
    return rows;
  };
  isValid = (board: TTCMove[][], x: number = -1, y: number = -1): boolean => {
    if (!board) return false;

    if (x < 0 || x > board.length || y < 0 || y > board.length) {
      return false;
    }
    const pos = board[x];
    if (!pos) return false;
    if (pos[y]?.choice) {
      return false;
    }
    if (this.checkBoard(board).winner) return false;
    return true;
  };
  newBlock = (params: TTCMove): TTCMove => {
    return {
      id: params.id,
      choice: params.choice,
      coords: {
        x: params?.coords.x,
        y: params?.coords.y,
      },
    };
  };

  checkBoard = (board: TTCMove[][]): TTCCombination => {
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
      let col = board.map((row) => row[i]).filter((i) => i) as TTCMove[];
      if (this.checkLine(col)) {
        winner.winner = col[0]!.id;
        winner.board = col;
      }
    }

    let diag1 = board.map((row, index) => row[index]) as TTCMove[];

    if (this.checkLine(diag1)) {
      winner.winner = diag1[0]!.id;
      winner.board = diag1;
    }
    let diag2 = board.map(
      (row, index) => row[board.length - index - 1]
    ) as TTCMove[];
    if (this.checkLine(diag2)) {
      winner.winner = diag2[0]!.id;
      winner.board = diag2;
    }

    let isFull = true;
    for (let i = 0; i < board.length; i++) {
      const elem = board[i];
      for (let j = 0; j < elem.length; j++) {
        if (!board[i][j].choice) {
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

  checkLine = (diagonal: TTCMove[]): boolean => {
    if (diagonal.length === 0) return false;
    for (let i = 0; i < diagonal.length; i++) {
      if (diagonal[i]?.choice !== diagonal[0]?.choice) {
        return false;
      }
    }
    return true;
  };
}

export const { generateBoard, isValid, newBlock, checkBoard, checkLine } =
  new TicTacToeBoard();

export class TicTacToeGame extends Game<"Tic Tac Toe"> {
  name: GameNames = "Tic Tac Toe";
  players: PlayerHandler<GameInfo<"Tic Tac Toe">["player"]> = new PlayerHandler<
    GameInfo<"Tic Tac Toe">["player"]
  >();
  board: TicTacToeBoard = new TicTacToeBoard();
  rounds: RoundHandler<GameInfo<"Tic Tac Toe">["round"]> = new RoundHandler<
    GameInfo<"Tic Tac Toe">["round"]
  >();
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
  addPlayer(player: TTCPlayer) {
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
        moves: {
          isTie: winner.isTie,
          moves: this.board.moves,
          loser: {
            id: winner.loser ? winner.loser : "",
          },
          winner: {
            id: winner.winner ? winner.winner : "",
          },
        },
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
  play(move: TTCMove) {
    this.board.addMove(move);
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
