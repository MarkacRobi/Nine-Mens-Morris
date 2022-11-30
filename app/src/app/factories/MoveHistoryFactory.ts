import {MoveHistory} from "../models/class/MoveHistory";
import {PutDownStoneAction} from "../models/class/PutDownStoneAction";
import {StoneFactory} from "./StoneFactory";
import {BoardScene} from "../models/class/BoardScene";
import {RemoveStoneAction} from "../models/class/RemoveStoneAction";
import {MoveStoneAction} from "../models/class/MoveStoneAction";
import {UserAction} from "../models/enum/UserAction";

export class MoveHistoryFactory {

  public static createDeepMoveHistoryCopy(moveHistory: MoveHistory, boardScene: BoardScene): MoveHistory {
    return new MoveHistory(
      moveHistory.moves.map(userMove => {
        if (userMove.type === UserAction.PUT_DOWN_STONE) {
          userMove = userMove as PutDownStoneAction;
          return new PutDownStoneAction(StoneFactory.createDeepStoneCopy(userMove.stone, boardScene), userMove.userHasNewMill)
        } else if (userMove.type === UserAction.REMOVE_STONE) {
          userMove = userMove as RemoveStoneAction;
          return new RemoveStoneAction(StoneFactory.createDeepStoneCopy(userMove.stone, boardScene))
        } else {
          userMove = userMove as MoveStoneAction;
          return new MoveStoneAction(
            StoneFactory.createDeepStoneCopy(userMove.removedStone, boardScene),
            userMove.userHasNewMill,
            userMove.moveFromPosition,
            userMove.putDownStone ? StoneFactory.createDeepStoneCopy(userMove.putDownStone, boardScene) : undefined
          )
        }
      }),
      moveHistory.currentIndex
    )
  }
}
