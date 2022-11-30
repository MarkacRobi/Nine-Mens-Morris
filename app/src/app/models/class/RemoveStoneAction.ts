import {Stone} from "./Stone";
import {Comparison} from "../interface/Comparison";
import {UserAction} from "../enum/UserAction";

export class RemoveStoneAction implements Comparison {
  /**
   * RemoveStoneAction represents action when user has mill and removes opponents stone
   */

  type = UserAction.REMOVE_STONE;
  stone: Stone; // stone being removed

  constructor(stone: Stone) {
    this.stone = stone;
  }

  isEqual(action: RemoveStoneAction): boolean {
    return action.stone.isEqualTo(this.stone);
  }
}
