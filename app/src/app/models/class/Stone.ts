import {StoneColor} from "../enum/StoneColor";
import {Player} from "./Player";
import {INode} from "../interface/INode";
import {ColorAdapter} from "../../adapters/ColorAdapter";


export class Stone {
  public position: number;
  public player: Player;
  public node: INode;
  public color: StoneColor;

  constructor(position: number, player: Player, node: INode) {
    this.position = position;
    this.player = player;
    this.node = node;
    this.color = player.color;
  }

  colorNode(): void {
    this.node.node.setFillStyle(ColorAdapter.getColorOfStone(this));
  }

  resetColor(): void {
    this.node.node.setFillStyle();
  }

  isWhite(): boolean {
    return this.player.color === StoneColor.WHITE;
  }

  isBlack(): boolean {
    return !this.isWhite();
  }

  isEqualTo(stone?: Stone): boolean {
    if (!stone) return false;
    return this.position === stone.position && this.player.isEqualTo(stone.player);
  }
}
