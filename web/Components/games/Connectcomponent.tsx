"use client";
import { CFMove, CFRound, CFplayer } from "@/../server/src/game/c4Game";
import { RoundType } from "@/../server/src/handlers/RoundHandler";
import { useUser } from "@/hooks/useUser";
import { newSocketAuth, socket } from "@/lib/socket";
import {
  CFState,
  Coords,
  Game,
  GameNames,
  GamePlayState,
  MoveChoice,
} from "@/types";
import { useNotification } from "../../hooks/useToast";
import dynamic from "next/dynamic";

const Sketch = dynamic(() => import("react-p5"), { ssr: false });
import p5types from "p5";
import { useCallback, useEffect, useRef, useState } from "react";
import { useUpdateEffect } from "usehooks-ts";
let p5: p5types;
const cols = 7;
const rows = 6;
const w = 100;
const dw = 80;
const width = cols * w;
const height = rows * w + w;
let playerPos = 0;
let prevPlayerPos = 0;
let win = 0;
const opponentName = "Opponent";
var canStart = false;

class Ball {
  speed: number = 5;
  startY: number = 2;
  endY: number;
  constructor(
    public x: number,
    public y: number,
    public color: number[] = [255, 255, 255],
    public playerId: string
  ) {
    this.y = 0 * w + (3 * w) / 2;
    this.endY = y * w + (3 * w) / 2;
  }
  move() {
    if (this.y < this.endY) {
      this.y += 10;
    }
  }
  show() {
    p5.noStroke();
    p5.fill(this.color);
    p5.ellipse(this.x * w + w / 2, this.y, dw);
  }
}
class PlayerBall {
  constructor(
    public x: number,
    public y: number,
    public color: number[] = [255, 255, 255]
  ) {}
  show() {
    p5.fill(this.color);
    p5.ellipse((playerPos + 0.5) * w, w / 2, dw);
  }
}

class GameState {
  moves: MoveChoice<CFMove>[] = [];
  board: (Ball | null)[][] = [];
  players: (CFplayer & { name: string })[] = [];
  game_winner: string = "";

  firstPlayerId: string = "";
  constructor() {
    this.board = this.generateBoard();
  }

  private generateBoard() {
    let b = [];
    for (let j = 0; j < rows; j++) {
      b[j] = new Array(cols).fill(null);
    }
    return b;
  }
  reset() {
    this.moves = [];
    this.board = this.generateBoard();
    this.game_winner = "";
    p5.loop();
  }

  addPlayer(player: CFplayer & { name: string }) {
    if (Object.values(this.players).find((i) => i.id == player.id)) return;

    this.players.push(player);
  }

  addPiece(x: number, player: CFplayer) {
    for (let i = rows - 1; i >= 0; i--) {
      if (this.board[i][x] == null) {
        this.board[i][x] = new Ball(
          x,
          i,
          player.choice == "red" ? [255, 0, 0] : [0, 0, 255],
          player.id
        );
        this.moves.push({
          id: player.id,
          move: {
            color: player.choice,
            coords: {
              x,
              y: i,
            },
          },
        });
        return;
      }
    }
  }
  currentPlayer() {
    if (this.moves.length == 0) {
      return this.players.find((x) => x.id == this.firstPlayerId);
    }
    return Object.values(this.players).find(
      (x) => x.id !== this.moves[this.moves.length - 1].id
    );
  }
  handleWin(winner: RoundType<CFRound>) {
    const colorWon = winner.winner.id;
    // console.log(this.players);
    // console.log(winner);
    const name = this.players.find((player) => player.id == colorWon)?.name;
    this.game_winner = name || "";
  }
  showWin() {
    p5.noStroke();
    p5.fill(0);
    if (win == 2) {
      p5.fill(0, 0, 255);
    } else if (win == 1) {
      p5.fill(255, 0, 0);
    }
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textSize(64);
    if (win == 4) {
      p5.text("Game Over!", width / 2, w / 2);
    } else if (win == 3) {
      p5.text("It is a tie.", width / 2, w / 2);
    } else {
      p5.text(`${this.game_winner} won!`, width / 2, w / 2);
    }
    p5.noLoop();
  }
}
const g = new GameState();

const gameId = "a0s9df0a9sdjf";
const gameType: GameNames = "connect Four";

export default function CONNECTFOURPAGE() {
  const [gameplaystate, setGameplaystate] = useState<GamePlayState>(
    GamePlayState.waiting
  );

  const ref = useRef(null);
  const toast = useNotification();
  const handleRematch = () => {
    socket.emit("rematch", () => {});
  };
  const [gameState, setGameState] = useState<CFState | null>();
  const { user } = useUser();
  const [player, setPlayer] = useState<CFplayer & { name: string }>({
    choice: "blue",
    id: "string2",
    name: "this currentusername",
  });
  const [opponent, setOpponent] = useState<CFplayer & { name: string }>({
    choice: "red",
    id: "string",
    name: opponentName,
  });
  const [ableToStart, setAbleToStart] = useState<boolean>(false);
  useEffect(() => {
    const socketAuth = newSocketAuth({
      user: user,
      roomId: gameId,
      gameName: gameType,
    });
    socket.auth = socketAuth;
    socket.connect();
    socket.emit("join_room", gameId);

    socket.on("get_players", (players: CFplayer[]) => {
      const opponent = players.find((player) => player.id != user.id);
      if (opponent) {
        setOpponent(opponent);
      }
      const player = players.find((player) => player.id == user.id);
      if (player) {
        setPlayer(player);
      }
    });
    socket.emit("player_ready");
    socket.on("c_player_move", (coords: Coords) => {
      // console.log(coords);
      playerPos = coords.x;
    });

    socket.on("rematch", () => {
      toast.addNotification("Opponent wants a rematch");
    });
    socket.on("rematch_accept", (state: CFState) => {
      console.log("rematch accept");
      setGameState(state);
      g.reset();
    });
    // socket.on('cf_choice', (gameState) => {})
    // socket.on('cf_game_winner')
    socket.on("start_game", () => {
      // console.log(canStart);
      canStart = true;
      socket.emit("get_state", (state: CFState) => {
        setGameState(state);
        const firstPlayer = state.currentPlayerTurn.id;
        g.firstPlayerId = firstPlayer;
        // console.log("state", state);
        const pl = state.players.find((player) => player.id == user.id);
        g.firstPlayerId = state.currentPlayerTurn.id;
        if (pl) {
          g.addPlayer({
            ...pl,
            name: user.name as string,
          });
        }
        const spl = state.players.find((player) => player.id != user.id);
        if (spl) {
          g.addPlayer({
            ...spl,
            name: opponentName,
          });
        }

        // console.log("state", state.players);
      });
    });
    socket.on("new_round", () => {
      g.reset();
      // console.log("new wrou");
      // g.addPlayer(player);
      // g.addPlayer(opponent);
      // console.log(g.currentPlayer());
      setGameplaystate(GamePlayState.playing);
      socket.emit("get_state", (state: CFState) => {
        setGameState(state);
      });
    });
    socket.on("user_disconnected", () => {
      window.location.reload();
    });
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });

    socket.on("connect_choice", (move) => {
      g.addPiece(move.move.move.coords.x, {
        choice: move.move.id == user.id ? "blue" : "red",
        id: move.move.id,
      });
    });
    socket.on("connect_game_winner", (winner) => {
      g.handleWin(winner);
    });
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  useUpdateEffect(() => {
    // console.log(ref);
  }, [ref]);

  const sendMouse = (playerPos: number) => {
    socket.emit("connect_choice", {
      id: user.id,
      move: {
        color: player.choice,
        coords: {
          x: playerPos,
          y: 0,
        },
      },
    });
  };

  const setup = (p: p5types, canvasRef: Element) => {
    if (!canvasRef) return;
    const canvas = p.createCanvas(width, height).parent(canvasRef);
    p5 = p;
    p.rectMode("center");
    canvas.mouseMoved(() => {
      if (playerPos != prevPlayerPos && g.currentPlayer()?.id == user.id) {
        socket.emit("c_player_move", { x: playerPos, y: 0 });
        prevPlayerPos = playerPos;
      }
    });
    canvas.mouseReleased(() => {
      sendMouse(playerPos);
    });
  };

  function draw(p: p5types) {
    p5 = p;
    p.background(225, 225, 255);
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        p.fill(0, 0, 0);
        g.board[j][i]?.move();
        g.board[j][i]?.show();
      }
    }
    const cplayer = g.currentPlayer();
    if (cplayer) {
      playerPos = cplayer.id == user.id ? Math.floor(p.mouseX / w) : playerPos;
      const playerBall = new PlayerBall(
        playerPos,
        0,
        cplayer?.choice == player.choice ? [0, 0, 255] : [255, 0, 0]
      );
      playerBall.show();
    }
    if (g.game_winner) {
      g.showWin();
      setGameplaystate(GamePlayState.end);
    }
  }

  return (
    <div className="m-auto  w-fit">
      <Sketch setup={setup} draw={draw} />
      <div className="text-6xl">
        <button onClick={handleRematch}>rematch</button>
      </div>
      <div>your wins: {gameState?.rounds?.wins[user?.id]}</div>
      <div>your opponent wins: {gameState?.rounds?.wins[opponent?.id]}</div>
    </div>
  );
}
