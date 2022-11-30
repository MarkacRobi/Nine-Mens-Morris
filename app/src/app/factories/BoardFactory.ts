import {Board} from "../models/class/Board";
import {BoardScene} from "../models/class/BoardScene";
import {StoneFactory} from "./StoneFactory";

export class BoardFactory {

  public static createDeepBoardCopy(board: Board, boardScene: BoardScene): Board {
    const newBoard = board.board.map(stone => {
      if (stone) {
        return StoneFactory.createDeepStoneCopy(stone, boardScene)
      } else {
        return undefined
      }
    })
    return new Board(newBoard)
  }
}
