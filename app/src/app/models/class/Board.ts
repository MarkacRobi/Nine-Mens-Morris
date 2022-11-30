import {BOARD_NODES_SIZE, boardNeighbors} from "../../constants";
import {Stone} from "./Stone";

export class Board {
  /**
   * @description Board object holds information about current state of the game (i.e. position of the pieces)
   */

  /**
   * @description Board represented as an Array of size 24
   */
  board: Array<Stone | undefined>;

  /**
   * @description Construct Board entity. If board array is passed, assign it to this board, else init new board
   */
  constructor(board?: Array<Stone | undefined>) {
    if (board) {
      // assign passed board to this
      this.board = board;
    } else {
      // initialise board with empty positions
      this.board = new Array(BOARD_NODES_SIZE);
      for(let i = 0; i < BOARD_NODES_SIZE; i++) this.board[i] = undefined;
    }
  }

  /**
   * @description Remove stone at given position
   */
  removeStone(position: number) {
    this.board[position] = undefined;
  }

  /**
   * @description Check if board is empty
   */
  isEmpty(): boolean {
    for(let i = 0; i < BOARD_NODES_SIZE; i++) {
      if (this.board[i] !== undefined) {
        return false;
      }
    }

    return true;
  }

  /**
   * @description Get stone for given position
   */
  getStone(position: number): Stone | undefined {
    return this.board[position];
  }

  /**
   * @description Put stone down on board at given position
   */
  putDownStone(position: number, stone: Stone): void {
    this.board[position] = stone;
    stone.position = position;
  }

  /**
   * @description Check if position is empty
   */
  isPositionEmpty(position: number) {
    return this.getStone(position) === undefined;
  }

  /**
   * @description Check if position is occupied
   */
  isPositionOccupied(position: number): boolean {
    return !this.isPositionEmpty(position);
  }

  /**
   * @description Re-paint nodes based on the stone color
   */
  repaintNodes(): void {
    this.board.forEach(stone => stone ? stone.colorNode() : undefined);
  }

  /**
   * @description Get positions neighbors
   * @param position - index of board array (must be >=0 and < 24)
   */
  getNeighborPositions(position: number) {
    // check if position index is valid and throw otherwise
    if (position < 0 || position >= BOARD_NODES_SIZE) throw new Error("[neighborLocation] 'position' must be >=0 and < 24!")

    return boardNeighbors[position];
  }

  /**
   * @description Print current board state to the console
   */
  print(): void {
    console.log(this.board[0] + "(00)----------------------" + this.board[1]  +
      "(01)----------------------" + this.board[2]  + "(02)")
    console.log("|                           |                           |")
    console.log("|                           |                           |")
    console.log("|                           |                           |")
    console.log("|       " + this.board[8]  + "(08)--------------" +
      this.board[9]  + "(09)--------------" + this.board[10]  + "(10)     |")
    console.log("|       |                   |                    |      |")
    console.log("|       |                   |                    |      |")
    console.log("|       |                   |                    |      |")
    console.log("|       |        " + this.board[16]  + "(16)-----" +
      this.board[17]  + "(17)-----" + this.board[18]  + "(18)       |      |")
    console.log("|       |         |                   |          |      |")
    console.log("|       |         |                   |          |      |")
    console.log("|       |         |                   |          |      |")
    console.log(this.board[3]  + "(03)---" + this.board[11]  + "(11)----" + this.board[19]  + "(19)               " +
      this.board[20]  + "(20)----" + this.board[12]  + "(12)---" + this.board[4]  + "(04)")
    console.log("|       |         |                   |          |      |")
    console.log("|       |         |                   |          |      |")
    console.log("|       |         |                   |          |      |")
    console.log("|       |        " + this.board[21]  + "(21)-----" +
      this.board[22]  + "(22)-----" + this.board[23]  + "(23)       |      |")
    console.log("|       |                   |                    |      |")
    console.log("|       |                   |                    |      |")
    console.log("|       |                   |                    |      |")
    console.log("|       " + this.board[13]  + "(13)--------------" +
      this.board[14]  + "(14)--------------" + this.board[15]  + "(15)     |")
    console.log("|                           |                           |")
    console.log("|                           |                           |")
    console.log("|                           |                           |")
    console.log(this.board[5]  + "(05)----------------------" + this.board[6]  +
      "(06)----------------------" + this.board[7]  + "(07)")
    console.log("\n")
  }
}
