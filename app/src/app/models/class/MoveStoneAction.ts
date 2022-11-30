import {Stone} from "./Stone";
import {Comparison} from "../interface/Comparison";
import {UserAction} from "../enum/UserAction";

export class MoveStoneAction implements Comparison {

  type = UserAction.MOVE_STONE;
  removedStone: Stone; // stone being moved
  userHasNewMill: boolean; // flag indicating whether newly put down stone created new mill
  moveFromPosition: number;
  putDownStone?: Stone; // stone that was put down

  constructor(stone: Stone, userHasNewMill: boolean, moveFromPosition: number, putDownStone?: Stone) {
    this.removedStone = stone;
    this.userHasNewMill = userHasNewMill;
    this.moveFromPosition = moveFromPosition;
    this.putDownStone = putDownStone ? putDownStone : undefined;
  }

  setPutDownStone(stone: Stone): void {
    this.putDownStone = stone;
  }

  isEqual(action: MoveStoneAction | undefined): boolean {
    if (action == undefined) return false;

    return this.userHasNewMill === action.userHasNewMill
      && this.removedStone.isEqualTo(action.removedStone)
      && this.moveFromPosition === action.moveFromPosition
      && (this.putDownStone ? this.putDownStone.isEqualTo(action.putDownStone) : true)
  }
}
