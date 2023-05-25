import { RockPaperScissorsGame } from "../game/rockpaperScissors";
import { Coords } from "../types/types";
import { TicTacToeGame } from "../game/TicTacToeGame";
import { MyIo, MySocket, getRoomId } from "../../server/src/server";
import { Room, getRoom } from "./room";
import { CFGame } from "../game/c4Game";
import { PlayerHandler, uhandler } from "./usersHandler";
import { SimonSaysGame } from "../game/simonSays";
import { GameNames, SMSMove, CFMove, RPSMove, TTCMove } from "../types/game";
import { IUser } from "../types/users";

export type IGame = CFGame &
  SimonSaysGame &
  TicTacToeGame &
  RockPaperScissorsGame;

const handleSimonSaysGame = (
  _: MyIo,
  socket: MySocket,
  game: SimonSaysGame
  // room: Room
) => {
  socket.on("sms_move", (move: SMSMove) => {
    game.play(move);
    if (game.hasLost) {
      // handle loss
      socket.emit("sms_game_lost");
    }
    if (game.sequenceComplete()) {
      // handle new round
      game.newRound();
      socket.emit("sms_new_round", game.getState());
    }
  });
};

const handleConnectGame = (
  io: MyIo,
  socket: MySocket,
  game: CFGame,
  _: Room
) => {
  socket.on("c_player_move", (move: Coords) => {
    io.to(getRoomId(socket)).emit("c_player_move", move);
  });
  socket.on("connect_choice", (move: CFMove) => {
    console.log("connect choice");

    if (game.isPlayerTurn(move.id)) {
      game.play(move);
      io.to(getRoomId(socket)).emit("connect_choice", {
        board: game.board,
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
  socket.on("ttc_choice", ({ move }: { move: TTCMove }) => {
    console.log(game.isPlayerTurn(move.id));
    if (game.isPlayerTurn(move.id)) {
      console.log(move);
      game.play(move);
      io.to(getRoomId(socket)).emit("ttc_choice", {
        board: game.board.board,
        move: move,
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
  game: RockPaperScissorsGame
  // room: Room
) => {
  // player move

  socket.on("rps_choice", (player: RPSMove) => {
    console.log(player);
    game?.play(
      {
        choice: player.choice,
        id: player.id,
      },
      player.choice
    );

    const roundWinner = game?.hasRoundWinner();
    if (roundWinner) {
      io.to(getRoomId(socket)).emit("round_winner", roundWinner);
      game?.newRound();
      const gameWinner = game?.hasGameWin();
      if (gameWinner) {
        const winner = uhandler.getUser(gameWinner.id)?.user;
        if (winner) {
          io.to(getRoomId(socket)).emit("rps_game_winner", {
            id: winner.id,
            created_at: winner.created_at ?? "",
            username: winner.username ?? "",
            email: winner.email ?? "",
          });
        }
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

export enum MatchPlayerState {
  playing,
  waiting_rematch,
}
type MatchPlayer = {
  id: string;
  state: MatchPlayerState;
};
export class MatchHandler {
  game: IGame;
  players: PlayerHandler<MatchPlayer> = new PlayerHandler<MatchPlayer>();
  constructor(game: IGame) {
    this.game = game;
  }

  addPlayer(player: IUser) {
    this.players.addPlayer({
      id: player.id,
      state: MatchPlayerState.playing,
    });
    this.game.addPlayer(player);
  }
  changePlayerState(
    playerId: string,
    state: MatchPlayerState
  ): MatchPlayer | null {
    const player = this.players.getPlayer(playerId);
    if (!player) return null;
    player.state = state;
    return player;
  }
  canRematch(): boolean {
    return this.players
      .getPlayers()
      .every((i) => i.state === MatchPlayerState.waiting_rematch);
  }
  private getGameHandler(gamename: GameNames) {
    switch (gamename) {
      case "Rock Paper Scissors":
        return handleRpsGame;
      case "Tic Tac Toe":
        return handleTTCGame;
      case "connect Four":
        return handleConnectGame;
      case "Simon Says":
        return handleSimonSaysGame;
    }
  }
  getGame(gameName: GameNames) {
    return getGame(gameName);
  }
  rematch() {
    saveGame(this.game);
    const players = this.game.getPlayers();
    const g = this.getGame(this.game.name);

    if (g) {
      for (const player of players) {
        g.addPlayer(player);
      }

      this.game = g;
    }

    this.players.getPlayers().forEach((player) => {
      this.changePlayerState(player.id, MatchPlayerState.playing);
    });
    console.log(this.game.players);
    return this.game;
  }
  newGame(gameName: GameNames) {
    const game = getGame(gameName);
    if (!game) return;
    saveGame(this.game);
    this.game = game;
  }
  playGame(io: MyIo, socket: MySocket, game: IGame) {
    const handler = this.getGameHandler(game.name);

    if (!handler) return;
    const room = getRoom(getRoomId(socket));
    if (!room) return;
    handler(io, socket, game, room);
  }
}

const saveGame = (_: IGame) => {
  console.log("game saved");
};

export const getGame = (gameName: GameNames): IGame => {
  switch (gameName) {
    case "Tic Tac Toe":
      return new TicTacToeGame() as IGame;
    case "Rock Paper Scissors":
      return new RockPaperScissorsGame() as IGame;
    case "connect Four":
      return new CFGame() as IGame;
    case "Simon Says":
      return new SimonSaysGame() as IGame;
  }
};
