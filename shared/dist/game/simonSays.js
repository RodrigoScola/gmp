"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimonSaysGame = void 0;
const game_1 = require("../types/game");
const RoundHandler_1 = require("../handlers/RoundHandler");
const usersHandler_1 = require("../handlers/usersHandler");
class SimonSaysGame extends game_1.Game {
    constructor() {
        super();
        this.name = "Simon Says";
        this.rounds = new RoundHandler_1.RoundHandler();
        this.playerSequence = [];
        this.sequence = ["blue"];
        this.players = new usersHandler_1.PlayerHandler();
    }
    get speed() {
        return this.getSpeed(this.rounds.count);
    }
    getSpeed(roundCount) {
        if (roundCount < 5) {
            return 900;
        }
        if (roundCount < 10) {
            return 700;
        }
        if (roundCount < 15) {
            return 500;
        }
        if (roundCount < 20) {
            return 250;
        }
        return 100;
    }
    addPlayer(player) {
        this.players.addPlayer(player);
    }
    play(move) {
        this.playerSequence.push(move);
    }
    get hasLost() {
        if (this.sequence.length == 0 || this.playerSequence.length == 0)
            return false;
        if (this.sequence[this.sequence.length - 1] !==
            this.playerSequence[this.playerSequence.length - 1].color) {
            return true;
        }
        return false;
    }
    sequenceComplete() {
        console.log(this.sequence.length, this.playerSequence.length);
        return this.sequence.length == this.playerSequence.length;
    }
    genRandomSequence(num) {
        const colors = ["blue", "green", "yellow", "red"];
        const sequence = [];
        for (let i = 0; i < num; i++) {
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            sequence.push(randomColor);
        }
        return sequence;
    }
    newRound() {
        this.rounds.addRound({
            moves: {
                sequence: this.playerSequence,
            },
            isTie: false,
            winner: {
                id: this.players.getPlayers()[0].id,
            },
        });
        this.sequence.push(this.genRandomSequence(1)[0]);
        this.playerSequence = [];
    }
    getPlayers() {
        const players = this.players.getPlayers();
        return players.map((i) => {
            return usersHandler_1.uhandler.getUser(i.id);
        });
    }
    toSequence(sequence) {
        return sequence.map((i) => ({
            id: this.getPlayers()[0].id,
            color: i,
        }));
    }
    getState() {
        return {
            name: this.name,
            players: this.getPlayers(),
            rounds: {
                count: this.rounds.count,
                rounds: this.rounds.rounds,
            },
            speed: this.speed,
            sequence: this.sequence,
        };
    }
    isReady() {
        return true;
    }
}
exports.SimonSaysGame = SimonSaysGame;
