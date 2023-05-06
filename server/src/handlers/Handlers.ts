import {
  GameNames,
  RockPaperScissorsCombination,
  MoveChoice,
  RockPaperScissorsMove,
} from "../../../web/types";
import { MyIo, MySocket, getRoomId } from "../server";
import { getRoom } from "./room";

const handleRpsGame = (
  io: MyIo,
  socket: MySocket,
  game: TicTacToeGame | RockPaperScissorsGame,
  room: Room
) => {
  // player move
  socket.on("rps_choice", (player) => {
    console.log(player);
    game?.play(
      {
        choice: player.move.choice,
        id: player.id,
      },
      player.move.choice
    );

    const roundWinner = game?.hasRoundWinner();
    console.log(roundWinner);
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
      choice: player.choice,
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
  playGame(io: MyIo, socket: MySocket, game) {
    const handler = this.getGameHandler(game.name);
    if (!handler) {
      console.log("no handler");
      return;
    }
    handler(io, socket, game, getRoom(getRoomId(socket)));
  }
}
