import { RockPaperScissorsGame } from "../game/rockpaperScissors";
import {
  GameNames,
  MoveChoice,
  RockPaperScissorPlayer,
  RockPaperScissorsMove,
  TTCMove,
  Game,
  gameNames,
} from "../../../web/types";
import { TicTacToeGame } from "../game/TicTacToeGame";
import { MyIo, MySocket, getRoomId } from "../server";
import { Room, getRoom } from "./room";

const handleTTCGame = (
  io: MyIo,
  socket: MySocket,
  game: TicTacToeGame,
  room: Room
) => {
  socket.on("ttc_choice", (move: MoveChoice<TTCMove>) => {
    if (game.isPlayerTurn(move.id)) {
      game.play(move, move.move.choice);
      io.to(getRoomId(socket)).emit("ttc_choice", {
        board: game.board.board,
        move: move,
      });
    }
    const winner = game.board.checkBoard(game.board.board);
    if (winner.winner) {
      io.to(getRoomId(socket)).emit("ttc_game_winner", winner);
      game.nextRound();
      console.log(game.board.board);
      setTimeout(() => {
        io.to(getRoomId(socket)).emit("new_round", winner);
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
  socket.on("rps_choice", (player: MoveChoice<RockPaperScissorsMove>) => {
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
      if (game?.hasGameWin()) {
        io.to(getRoomId(socket)).emit("rps_game_winner", game.hasGameWin());
      } else {
        setTimeout(() => {
          io.to(getRoomId(socket)).emit("new_round");
        }, 10);
      }
    }
    io.to(getRoomId(socket)).emit("rps_choice", {
      id: player.id,
      choice: player.move.choice,
    });
  });
};
export class GameHandler {
  getGameHandler(gamename: GameNames) {
    switch (gamename) {
      case "Rock Paper Scissors":
        return handleRpsGame;
      case "Tic Tac Toe":
        return handleTTCGame;
    }
  }
  getGame(gameName: GameNames) {
    return getGame(gameName);
  }
  playGame(io: MyIo, socket: MySocket, game: Game) {
    const handler = this.getGameHandler(game.name);

    if (!handler) return;
    handler(io, socket, game, getRoom(getRoomId(socket)));
  }
}

export const getGame = (gameName: GameNames): Game | null => {
  switch (gameName) {
    case "Tic Tac Toe":
      return TicTacToeGame;
    case "Rock Paper Scissors":
      return RockPaperScissorsGame;
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
