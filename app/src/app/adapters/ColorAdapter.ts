import {Stone} from "../models/class/Stone";
import {HexColors} from "../models/enum/HexColors";
import Color = Phaser.Display.Color;
import {INode} from "../models/interface/INode";
import {Game} from "../models/class/Game";

export class ColorAdapter {

  /**
   * An Adapter interface between exposing simplified methods for dealing with color related game logic
   */

  game: Game;
  nodeInfo: INode;

  constructor(nodeInfo: INode, game: Game) {
    this.nodeInfo = nodeInfo;
    this.game = game;
  }

  /**
   * @description Reset node color to "empty"
   */
  resetNodeColor(): void {
    this.nodeInfo.node.setFillStyle();
  }

  setColorBasedOnStone(): void {
    ColorAdapter.setColorForStone(this.nodeInfo, this.game.getBoardStone(this.nodeInfo.position));
  }

  public static setColorForStone(node: INode, stone?: Stone): void {
    node.node.setFillStyle(ColorAdapter.getColorOfStone(stone));
  }


  /**
   * Static methods
   */

  /**
   * @description Get appropriate color number for given stone
   * @param stone - Type of stone for which color should be sought for
   * @return number - Color number
   */
  public static getColorOfStone(stone?: Stone): number | undefined {
    if (!stone) return undefined;
    return Color.HexStringToColor(stone.isWhite() ? HexColors.WHITE : HexColors.BLACK).color;
  }

  isEqualTo(colorAdapter: ColorAdapter): boolean {
    return this.nodeInfo.position == colorAdapter.nodeInfo.position;
  }

}
