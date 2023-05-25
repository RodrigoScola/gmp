"use client";
import dynamic from "next/dynamic";
const Sketch = dynamic(() => import("react-p5"), { ssr: false });
import { useRef } from "react";
import { useUpdateEffect } from "usehooks-ts";
let p5;
const cols = 7;
const rows = 6;
const w = 100;
const dw = 80;
const width = cols * w;
const height = rows * w + w;
let playerPos = 0;
let win = 0;
let player = 1;
class Ball {
    constructor(x, y, color = [255, 255, 255], playerId) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.playerId = playerId;
        this.speed = 5;
        this.startY = 2;
        this.y = (0 * w + 3 * w / 2);
        this.endY = (y * w + 3 * w / 2);
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
    constructor(x, y, color = [255, 255, 255]) {
        this.x = x;
        this.y = y;
        this.color = color;
    }
    show() {
        p5.fill(this.color);
        p5.ellipse((playerPos + 0.5) * w, w / 2, dw);
    }
}
class Player {
    constructor({ ballColor = [255, 255, 255], name = "you", }) {
        this.ballColor = ballColor;
        this.name = name;
    }
}
class GameState {
    constructor(players) {
        this.players = players;
        this.moves = [];
        this.board = [];
        for (let j = 0; j < rows; j++) {
            this.board[j] = new Array(cols).fill(null);
        }
    }
    nextPlayer() {
        player = player == 1 ? 2 : 1;
    }
    addPiece(x) {
        for (let i = rows - 1; i >= 0; i--) {
            if (this.board[i][x] == null) {
                this.board[i][x] = new Ball(x, i, this.currentPlayer().ballColor, player);
                this.moves.push({
                    player: this.currentPlayer(),
                    coords: {
                        x,
                        y: i
                    }
                });
                return;
            }
        }
        console.log(this.board);
    }
    currentPlayer() {
        return this.players[player - 1];
    }
    checkWin() {
        // help
        for (let j = 0; j < rows; j++) {
            for (let i = 0; i <= cols - 4; i++) {
                const test = this.board[j][i];
                if (test) {
                    let temp = true;
                    for (let k = 0; k < 4; k++) {
                        if (this.board[j][i + k]?.playerId !== test.playerId) {
                            temp = false;
                        }
                    }
                    if (temp == true) {
                        return true;
                    }
                }
            }
        }
        for (let j = 0; j <= rows - 4; j++) {
            for (let i = 0; i < cols; i++) {
                const test = this.board[j][i];
                if (test) {
                    let temp = true;
                    for (let k = 0; k < 4; k++) {
                        if (this.board[j + k][i]?.playerId !== test.playerId) {
                            temp = false;
                        }
                    }
                    if (temp == true) {
                        return true;
                    }
                }
            }
            for (let i = 0; i <= cols - 4; i++) {
                const test = this.board[j][i];
                if (test) {
                    let temp = true;
                    for (let k = 0; k < 4; k++) {
                        if (this.board[j + k][i + k]?.playerId !== test.playerId) {
                            temp = false;
                        }
                    }
                    if (temp == true) {
                        return true;
                    }
                }
            }
            for (let i = 3; i <= cols; i++) {
                const test = this.board[j][i];
                if (test) {
                    let temp = true;
                    for (let k = 0; k < 4; k++) {
                        if (this.board[j + k][i - k]?.playerId !== test.playerId) {
                            return true;
                        }
                    }
                    if (temp == true) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    handleWin() {
        p5.noStroke();
        p5.fill(0);
        if (win == 2) {
            p5.fill(0, 0, 255);
        }
        else if (win == 1) {
            p5.fill(255, 0, 0);
        }
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.textSize(64);
        if (win == 4) {
            p5.text("Game Over!", width / 2, w / 2);
        }
        else if (win == 3) {
            p5.text("It is a tie.", width / 2, w / 2);
        }
        else {
            p5.text(`${this.currentPlayer().name} won!`, width / 2, w / 2);
        }
        p5.noLoop();
    }
}
const g = new GameState([new Player({
        ballColor: [255, 0, 0],
        name: "red"
    }), new Player({
        ballColor: [0, 0, 255],
        "name": "enemy"
    })]);
export default function CONNECTFOURPAGE() {
    const ref = useRef(null);
    useUpdateEffect(() => {
        console.log(ref);
    }, [ref]);
    const setup = (p, canvasRef) => {
        if (!canvasRef)
            return;
        p.createCanvas(width, height).parent(canvasRef);
        p5 = p;
        p.rectMode("center");
        p.mousePressed = () => {
            console.time("addPiece");
            console.log(g.checkWin());
            console.timeEnd('addPiece');
            if (g.checkWin()) {
                setTimeout(() => {
                    win = player;
                }, 500);
            }
            else {
                g.nextPlayer();
                g.addPiece(playerPos);
            }
        };
    };
    function draw(p) {
        p5 = p;
        p.background(225, 225, 255);
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                p.fill(0, 0, 0);
                g.board[j][i]?.move();
                g.board[j][i]?.show();
            }
        }
        playerPos = Math.floor(p.mouseX / w);
        const playerBall = new PlayerBall(playerPos, 0, player == 1 ? [0, 0, 255] : [255, 0, 0]);
        playerBall.show();
        if (win != 0) {
            g.handleWin();
        }
    }
    console.log(ref);
    return (<div className="m-auto  w-fit">
			<Sketch setup={setup} draw={draw}/>
		</div>);
}
