import {Stone} from "./Stone";
import {Comparison} from "../interface/Comparison";
import {UserAction} from "../enum/UserAction";

export class PutDownStoneAction implements Comparison {
  /**
   * @description PutDownStoneAction class is used as a DTO for put down stone in stage 1 of the game
   */

  type = UserAction.PUT_DOWN_STONE;
  stone: Stone; // stone being put down
  userHasNewMill: boolean; // flag indicating whether newly put down stone created new mill

  constructor(stone: Stone, userHasNewMill: boolean) {
    this.stone = stone;
    this.userHasNewMill = userHasNewMill;
  }

  isEqual(action: PutDownStoneAction | undefined): boolean {
    if (action == undefined) return false;

    return this.userHasNewMill === action.userHasNewMill
      && this.stone.isEqualTo(action.stone)
  }
}
