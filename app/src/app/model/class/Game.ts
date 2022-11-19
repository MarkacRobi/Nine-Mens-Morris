import {GameStatus} from "../enum/GameStatus";
import {Board} from "./Board";

export class Game {
  /**
   * @description Game object represents an entity holding all information about specific game
   */


  // current status of the game
  status: GameStatus;

  // board associated with this game
  board: Board;

  constructor() {
    this.status = GameStatus.DEFAULT;
    this.board = new Board();
  }
}
