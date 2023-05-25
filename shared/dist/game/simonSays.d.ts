import { SMSColorType, Game, GameNames, SMSMove, SMSRound, SMState, SMSPlayer } from "../types/game";
import { RoundHandler } from "../handlers/RoundHandler";
import { PlayerHandler } from "../handlers/usersHandler";
export declare class SimonSaysGame extends Game<"Simon Says"> {
    name: GameNames;
    players: PlayerHandler<SMSPlayer>;
    rounds: RoundHandler<SMSRound>;
    sequence: SMSColorType[];
    playerSequence: SMSMove[];
    constructor();
    get speed(): 900 | 700 | 500 | 250 | 100;
    private getSpeed;
    addPlayer(player: SMSPlayer): void;
    play(move: SMSMove): void;
    get hasLost(): boolean;
    sequenceComplete(): boolean;
    genRandomSequence(num: number): SMSColorType[];
    newRound(): void;
    getPlayers(): any[];
    toSequence(sequence: SMSColorType[]): SMSMove[];
    getState(): SMState;
    isReady(): boolean;
}
