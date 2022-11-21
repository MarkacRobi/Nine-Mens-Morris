import {BoardPosition} from "./BoardPosition";
import {boardNeighbors} from "../../constants";
import {BoardFigure} from "../enum/BoardFigure";

export class Board {
  /**
   * @description Board object holds information about current state of the game (i.e. position of the pieces)
   */

  // board is represented as an Array of size 24
  board: BoardPosition[];

  constructor() {
    this.board = new Array(24);
    // initialise board with empty positions
    for(let i = 0; i < 24; i++) this.board[i] = new BoardPosition(i);
  }

  isEmpty(): boolean {
    for(let i = 0; i < 24; i++) {
      if (this.board[i].figure !== BoardFigure.EMPTY) {
        return false;
      }
    }

    return true;
  }

  /**
   * @description Get positions neighbors
   * @param position - index of board array (must be >=0 and < 24)
   */
  neighborLocation(position: number) {
    // check if position index is valid and throw otherwise
    if (position < 0 || position >= 24) throw new Error("[neighborLocation] 'position' must be >=0 and < 24!")

    return boardNeighbors[position];
  }

  /**
   * @description Print current board state to the console
   */
  print(): void {
    console.log(this.board[0].figure + "(00)----------------------" + this.board[1].figure  +
      "(01)----------------------" + this.board[2].figure  + "(02)")
    console.log("|                           |                           |")
    console.log("|                           |                           |")
    console.log("|                           |                           |")
    console.log("|       " + this.board[8].figure  + "(08)--------------" +
      this.board[9].figure  + "(09)--------------" + this.board[10].figure  + "(10)     |")
    console.log("|       |                   |                    |      |")
    console.log("|       |                   |                    |      |")
    console.log("|       |                   |                    |      |")
    console.log("|       |        " + this.board[16].figure  + "(16)-----" +
      this.board[17].figure  + "(17)-----" + this.board[18].figure  + "(18)       |      |")
    console.log("|       |         |                   |          |      |")
    console.log("|       |         |                   |          |      |")
    console.log("|       |         |                   |          |      |")
    console.log(this.board[3].figure  + "(03)---" + this.board[11].figure  + "(11)----" + this.board[19].figure  + "(19)               " +
      this.board[20].figure  + "(20)----" + this.board[12].figure  + "(12)---" + this.board[4].figure  + "(04)")
    console.log("|       |         |                   |          |      |")
    console.log("|       |         |                   |          |      |")
    console.log("|       |         |                   |          |      |")
    console.log("|       |        " + this.board[21].figure  + "(21)-----" +
      this.board[22].figure  + "(22)-----" + this.board[23].figure  + "(23)       |      |")
    console.log("|       |                   |                    |      |")
    console.log("|       |                   |                    |      |")
    console.log("|       |                   |                    |      |")
    console.log("|       " + this.board[13].figure  + "(13)--------------" +
      this.board[14].figure  + "(14)--------------" + this.board[15].figure  + "(15)     |")
    console.log("|                           |                           |")
    console.log("|                           |                           |")
    console.log("|                           |                           |")
    console.log(this.board[5].figure  + "(05)----------------------" + this.board[6].figure  +
      "(06)----------------------" + this.board[7].figure  + "(07)")
    console.log("\n")
  }
}
