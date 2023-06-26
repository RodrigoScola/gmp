import { RoundHandler } from "../handlers/RoundHandler"
import { PlayerHandler } from "../handlers/usersHandler"
import {
     Board,
     CFMove,
     CFRound,
     CFState,
     CFplayer,
     Game,
     GameNames,
     MoveChoice,
     RoundType,
} from "../types/game"

const dir = [
     [0, 1],
     [0, -1],
     [1, 0],
     [1, 1],
     [1, -1],
     [-1, 0],
     [-1, 1],
]

export class CFBoard extends Board<CFMove> {
     board: CFMove[][]
     moves: CFMove[] = []
     rows: number = 7
     cols: number = 6

     constructor() {
          super()
          this.board = this.generateBoard()
     }

     generateBoard(): CFMove[][] {
          let rows: CFMove[][] = []
          for (let i = 0; i < this.rows; i++) {
               rows[i] = new Array(this.cols).fill({
                    id: "",
                    move: {
                         color: [0, 0, 0],
                         coords: {
                              x: 0,
                              y: 0,
                         },
                    },
               })
          }
          return rows
     }
     addMove(move: CFMove): void {
          if (!this.isValid(this.board, move.coords.x, move.coords.y)) return
          for (let i = this.rows - 1; i >= 0; i--) {
               const board = this.board

               const pos = board[i]
               if (!pos) continue
               if (!pos[move.coords.x]?.id) {
                    const nmove = {
                         id: move.id,
                         color: move.color,
                         coords: {
                              x: move.coords.x,
                              y: i,
                         },
                    }
                    pos[move.coords.x] = nmove
                    this.moves.push(nmove)
                    // console.log(this.board);
                    break
               }
          }

          // console.log(this.board);
     }

     private walkBoard(
          board: CFMove[][],
          currentPiece: CFMove,
          visited: boolean[][],
          len: number,
          target: CFMove
     ): boolean {
          if (currentPiece.id == "" || !board) return false
          if (
               currentPiece.coords.y > board.length ||
               currentPiece.coords.y < 0 ||
               currentPiece.coords.x < 0 ||
               currentPiece.coords.x > board[0].length
          ) {
               return false
          }
          if (currentPiece.id !== target.id) {
               return false
          }
          if (visited[currentPiece.coords.y][currentPiece.coords.x] == true) {
               return false
          }
          visited[currentPiece.coords.y][currentPiece.coords.x] = true
          if (len == 4) return true
          for (let i = 0; i < dir.length; i++) {
               const [x, y] = dir[i]
               if (!board[currentPiece.coords.y + y]) continue

               let newPiece =
                    board[currentPiece.coords.y + y][currentPiece.coords.x + x]
               if (!newPiece) continue
               if (this.walkBoard(board, newPiece, visited, len + 1, target)) {
                    return true
               }
          }

          return false
     }
     checkBoard(): boolean {
          if (this.moves.length < 7) return false
          const lastMove = this.moves[this.moves.length - 1]

          let seen = []
          for (let i = 0; i < this.board.length; i++) {
               seen[i] = new Array(this.board[0].length).fill(false)
          }

          if (!lastMove) return false

          const b = this.walkBoard(this.board, lastMove, seen, 0, lastMove)

          console.log(b)

          return true
     }

     isTie() {
          for (let i = 0; i < this.rows; i++) {
               for (let j = 0; j < this.cols; j++) {
                    if (!this.board[i][j].id) return false
               }
          }
          return true
     }
     isValid(board: CFMove[][], x: number, y: number): boolean {
          if (!board) return false
          if (x < 0 || x > board[0].length || y < 0 || y > board.length) {
               return false
          }
          console.log(board.length, board[0].length, x)
          const pos = board[y][x]
          if (!pos) return false

          if (board[x][y].id) return false

          return true
     }
}

export class CFGame extends Game<"connect Four"> {
     name: GameNames = "connect Four"
     board: CFBoard
     rounds: RoundHandler<CFRound> = new RoundHandler()
     moves: CFMove[] = []
     players: PlayerHandler<CFplayer> = new PlayerHandler<CFplayer>()

     addPlayer(player: CFplayer) {
          const choice = this.players.getPlayers().length == 1 ? "red" : "blue"
          this.players.addPlayer({
               id: player.id,
               choice,
          })
     }
     getPlayers(): CFplayer[] {
          return this.players.getPlayers()
     }
     isReady() {
          return this.getPlayers().length == 2
     }
     constructor() {
          super()
          this.board = new CFBoard()
     }

     getState(): CFState {
          let playerWins: Record<string, number> = {}

          for (const p of this.players.getPlayers()) {
               playerWins[p.id] = this.rounds.countWins(p.id)
          }

          return {
               board: this.board.board,
               currentPlayerTurn: this.players.getPlayers()[0],
               moves: this.board.moves,
               name: this.name,
               players: this.players.getPlayers(),
               rounds: {
                    count: this.rounds.count,
                    rounds: this.rounds.rounds,
                    wins: {
                         ...playerWins,
                         ties: this.rounds.rounds.filter((i) => i.isTie).length,
                    },
               },
          }
     }
     newRound(): void {
          if (this.moves.length == 0) return
          let w = {
               id: "",
          }
          let wi = this.getWinner()
          if (wi?.winner) {
               w.id = wi.winner.id
          }

          this.rounds.addRound({
               isTie: false,
               winner: w,
               moves: {
                    moves: this.moves,
               },
          })
          this.moves = []
          this.board = new CFBoard()
     }

     isPlayerTurn(playerId: string): boolean {
          if (this.moves.length == 0) {
               return this.players.getPlayers()[0].id == playerId
          }
          return this.moves[this.moves.length - 1].id !== playerId
     }
     playerTurn() {
          if (this.board.moves.length == 0) {
               return this.players.getPlayers().find((i) => i.choice == "blue")
          }
          return this.board.moves[this.board.moves.length - 1]
     }
     getWinner(): RoundType<CFRound> | null {
          const hasWin = this.board.checkBoard()

          if (!hasWin) return null
          const winner = this.moves[this.moves.length - 1]

          return {
               isTie: false,
               winner: winner,
               moves: {
                    moves: this.moves,
               },
          }
     }
     play(move: MoveChoice<CFMove>): void {
          // console.log(this.moves);
          this.board.addMove(move)
          this.moves.push(move)
     }
}
export const { generateBoard } = new CFBoard()
