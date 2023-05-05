import {
  GameNames,
  MoveChoice,
  RockPaperScissorPlayer,
  RockPaperScissorsMove,
  TicTacToeMove,
} from "../../../web/types";
import { TicTacToeGame } from "../game/TicTacToeGame";
import { MyIo, MySocket, getRoomId } from "../server";
import { Room, getRoom } from "./room";

export interface Game {
  name: GameNames;
}
const handleTTCGame = (
  io: MyIo,
  socket: MySocket,
  game: TicTacToeGame,
  room: Room
) => {
  console.log(game);
  console.log(game);
  console.log(game);
  console.log(game);
  console.log(game);
  socket.on("ttc_choice", (move: TicTacToeMove) => {
    if (game.isPLayerTurn(move.id)) {
      game.play(move);
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
        io.to(getRoomId(socket)).emit("game_winner", game.hasGameWin());
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
    }
  }
  getGame(gameName: GameNames) {
    switch (gameName) {
      case "Tic Tac Toe":
        return new TicTacToeGame();
      case "Rock Paper Scissors":
        return new RockPaperScissorsGame();
    }
  }

  playGame(io: MyIo, socket: MySocket, game) {
    const handler = this.getGameHandler(game.name);

    if (!handler) return;
    handler(io, socket, game, getRoom(getRoomId(socket)));
  }
}
