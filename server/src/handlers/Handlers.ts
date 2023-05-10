import { RockPaperScissorsGame } from "../game/rockpaperScissors";
import {
  GameNames,
  MoveChoice,
  RPSMove,
  Game,
  Coords,
  User,
} from "../../../web/types";
import { TicTacToeGame } from "../game/TicTacToeGame";
import { MyIo, MySocket, getRoomId } from "../server";
import { Room, getRoom } from "./room";
import { CFGame } from "../game/c4Game";
import { PlayerHandler } from "./usersHandler";

const handleConnectGame = (
  io: MyIo,
  socket: MySocket,
  game: CFGame,
  room: Room
) => {
  socket.on("c_player_move", (move: Coords) => {
    io.to(getRoomId(socket)).emit("c_player_move", move);
  });
  socket.on("connect_choice", (move) => {
    console.log("connect choice");
    if (game.isPlayerTurn(move.id)) {
      game.play(move);
      io.to(getRoomId(socket)).emit("connect_choice", {
        board: game.board.board,
        move: move,
      });
      const winner = game.getWinner();

      if (winner) {
        io.to(getRoomId(socket)).emit("connect_game_winner", winner);
        console.log(winner);
        setTimeout(() => {
          io.to(getRoomId(socket)).emit("new_round");
          game.newRound();
        }, 1000);
      }
    }
  });
};

const handleTTCGame = (
  io: MyIo,
  socket: MySocket,
  game: TicTacToeGame
  // room: Room
) => {
  socket.on("ttc_choice", ({ move }) => {
    console.log(game.isPlayerTurn(move.id));
    if (game.isPlayerTurn(move.id)) {
      console.log(move);
      game.play(move);
      io.to(getRoomId(socket)).emit("ttc_choice", {
        board: game.board.board,
        move: move.move,
      });
    }
    const winner = game.board.checkBoard(game.board.board);
    if (winner.winner) {
      io.to(getRoomId(socket)).emit("ttc_game_winner", winner);
      setTimeout(() => {
        io.to(getRoomId(socket)).emit("new_round");
        game.newRound();
      }, 1000);
    }
  });
};

const handleRpsGame = (
  io: MyIo,
  socket: MySocket,
  game: RockPaperScissorsGame,
  room: Room
) => {
  // player move

  socket.on("rps_choice", (player: MoveChoice<RPSMove>) => {
    console.log(player);
    game?.play(
      {
        choice: player.move.choice,
        id: player.id,
      },
      player.move.choice
    );

    const roundWinner = game?.hasRoundWinner();
    if (roundWinner) {
      io.to(getRoomId(socket)).emit("round_winner", roundWinner);
      game?.newRound();
      const gameWinner = game?.hasGameWin();
      if (gameWinner) {
        io.to(getRoomId(socket)).emit("rps_game_winner", gameWinner);
      } else {
        setTimeout(() => {
          io.to(getRoomId(socket)).emit("new_round");
        }, 10);
      }
    }
    io.to(getRoomId(socket)).emit("rps_choice", {
      id: player.id,
      move: {
        choice: player.move.choice,
      },
    });
  });
};

export enum MatchPlayerState {
  playing,
  waiting_rematch,
}
type MatchPlayer = {
  id: string;
  state: MatchPlayerState;
};
export class MatchHandler {
  game: Game;
  players: PlayerHandler<MatchPlayer> = new PlayerHandler<MatchPlayer>();
  constructor(game: Game) {
    this.game = game;
  }

  addPlayer(player: User) {
    this.players.addPlayer({
      id: player.id,
      state: MatchPlayerState.playing,
    });
    this.game.addPlayer(player);
  }

  private getGameHandler(gamename: GameNames) {
    switch (gamename) {
      case "Rock Paper Scissors":
        return handleRpsGame;
      case "Tic Tac Toe":
        return handleTTCGame;
      case "connect Four":
        return handleConnectGame;
      default:
        return null;
    }
  }
  getGame(gameName: GameNames) {
    return getGame(gameName);
  }
  rematch() {
    saveGame(this.game);
  }
  newGame(gameName: GameNames) {
    const game = getGame(gameName);
    if (!game) return;
    saveGame(this.game);
    this.game = game;
  }
  playGame(io: MyIo, socket: MySocket, game: Game) {
    const handler = this.getGameHandler(game.name);

    if (!handler) return;
    handler(io, socket, game, getRoom(getRoomId(socket)));
  }
}

const saveGame = <T extends Game>(game: T) => {
  console.log("game saved");
};

export const getGame = (gameName: GameNames): Game | null => {
  switch (gameName) {
    case "Tic Tac Toe":
      return new TicTacToeGame();
    case "Rock Paper Scissors":
      return new RockPaperScissorsGame();
    case "connect Four":
      return new CFGame();
    default:
      return null;
  }
};

export const games: Record<number, { id: number; name: GameNames }> = {
  0: { id: 0, name: "connect Four" },
  1: { id: 1, name: "Tic Tac Toe" },
  2: { id: 2, name: "Rock Paper Scissors" },
  3: { id: 3, name: "Simon Says" },
};
export const getGameData = (gameIdOrName: GameNames | number) => {
  if (typeof gameIdOrName === "number") {
    const game = games[gameIdOrName];
    if (game) return game;
    else throw new Error("Game not found");
  } else {
    const game = Object.values(games).find(
      (game) => game.name === gameIdOrName
    );
    if (game) return game;
    else throw new Error("Game not found");
  }
};
