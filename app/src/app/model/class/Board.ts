import {BoardPosition} from "../enum/BoardPosition";
import {boardNeighbors} from "../../constants";

export class Board {
  /**
   * @description Board object holds information about current state of the game (i.e. position of the pieces)
   */

  // board is represented as an Array of size 24
  board: BoardPosition[];

  constructor() {
    this.board = new Array(24);
    for(let i = 0; i < 24; i++) this.board[i] = BoardPosition.EMPTY;
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
    console.log(this.board[0] + "(00)----------------------" + this.board[1] +
      "(01)----------------------" + this.board[2] + "(02)")
    console.log("|                           |                           |")
    console.log("|                           |                           |")
    console.log("|                           |                           |")
    console.log("|       " + this.board[8] + "(08)--------------" +
      this.board[9] + "(09)--------------" + this.board[10] + "(10)     |")
    console.log("|       |                   |                    |      |")
    console.log("|       |                   |                    |      |")
    console.log("|       |                   |                    |      |")
    console.log("|       |        " + this.board[16] + "(16)-----" +
      this.board[17] + "(17)-----" + this.board[18] + "(18)       |      |")
    console.log("|       |         |                   |          |      |")
    console.log("|       |         |                   |          |      |")
    console.log("|       |         |                   |          |      |")
    console.log(this.board[3] + "(03)---" + this.board[11] + "(11)----" + this.board[19] + "(19)               " +
      this.board[20] + "(20)----" + this.board[12] + "(12)---" + this.board[4] + "(04)")
    console.log("|       |         |                   |          |      |")
    console.log("|       |         |                   |          |      |")
    console.log("|       |         |                   |          |      |")
    console.log("|       |        " + this.board[21] + "(21)-----" +
      this.board[22] + "(22)-----" + this.board[23] + "(23)       |      |")
    console.log("|       |                   |                    |      |")
    console.log("|       |                   |                    |      |")
    console.log("|       |                   |                    |      |")
    console.log("|       " + this.board[13] + "(13)--------------" +
      this.board[14] + "(14)--------------" + this.board[15] + "(15)     |")
    console.log("|                           |                           |")
    console.log("|                           |                           |")
    console.log("|                           |                           |")
    console.log(this.board[5] + "(05)----------------------" + this.board[6] +
      "(06)----------------------" + this.board[7] + "(07)")
    console.log("\n")
  }
}
