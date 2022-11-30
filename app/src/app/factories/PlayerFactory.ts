import {Player} from "../models/class/Player";
import {StoneColor} from "../models/enum/StoneColor";
import {STONES_PER_PLAYER} from "../constants";

export class PlayerFactory {

  /**
   * @description Factory responsible for creation of player entities
   */

  public static createDeepPlayerCopy(player: Player): Player {
    return new Player(player.color, player.stonesLeft, player.stonesOnBoard, player.stonesOnBoard);
  }


  public static createWhitePlayer(): Player {
    return new Player(StoneColor.WHITE, STONES_PER_PLAYER, 0, 0);
  }

  public static createBlackPlayer(): Player {
    return new Player(StoneColor.BLACK, STONES_PER_PLAYER, 0, 0);
  }
}
