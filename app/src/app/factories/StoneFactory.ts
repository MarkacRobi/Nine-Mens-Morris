import {Stone} from "../models/class/Stone";
import {Player} from "../models/class/Player";
import {INode} from "../models/interface/INode";
import {BoardScene} from "../models/class/BoardScene";
import {PlayerFactory} from "./PlayerFactory";

export class StoneFactory {

  /**
   * @description Factory responsible for creation of various stones
   */

  public static createStoneBasedOnPlayerTurn(player: Player, position: number, node: INode): Stone {
    return this.createStone(position, player, node);
  }

  public static createStone(position: number, player: Player, node: INode): Stone {
    return new Stone(position, player, node);
  }

  public static createDeepStoneCopy(stone: Stone, boardScene: BoardScene): Stone {
    return new Stone(stone.position, PlayerFactory.createDeepPlayerCopy(stone.player), {
      position: stone.position,
      node: boardScene.getArc(stone.position)!
    });
  }
}
