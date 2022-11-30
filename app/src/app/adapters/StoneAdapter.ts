import {Game} from "../models/class/Game";
import {Stone} from "../models/class/Stone";
import {INode} from "../models/interface/INode";

export class StoneAdapter {

  /**
   * An Adapter interface between exposing simplified methods for dealing with stone related game logic
   */

  game: Game;
  nodeInfo: INode

  constructor(game: Game, nodeInfo: INode) {
    this.game = game;
    this.nodeInfo = nodeInfo;
  }

  isPositionEmpty(): boolean {
    return this.game.isPositionEmpty(this.nodeInfo.position);
  }

  isPositionOccupied(): boolean {
    return !this.game.isPositionEmpty(this.nodeInfo.position);
  }


  canStoneBeMoved(): boolean {
    // check if any of neighbor positions is empty
    return this.game.board.getNeighborPositions(this.nodeInfo.position).some(position => this.game.isPositionEmpty(position));
  }

  isNodeNeighborOfMovingStone(): boolean {
    if (!this.game.stoneBeingMoved) return false;
    const neighborPositions = this.game.board.getNeighborPositions(this.game.stoneBeingMoved.position);

    // return true if node position is in the array of neighbor positions
    return neighborPositions.includes(this.nodeInfo.position);
  }

  private isOpponentsStone(stone: Stone): boolean {
    return stone.player.color !== this.game.getCurrentPlayer().color;
  }

  isOpponentsStoneAtPosition(): boolean {
    const stone = this.getStone();
    return stone ? this.isOpponentsStone(stone) : false;
  }

  isCurrentPlayerStoneAtPosition(): boolean {
    return this.getStone()?.player.color === this.game.getCurrentPlayer().color;
  }

  canRemoveStone(): boolean {
    return this.game.canRemoveStone(this.nodeInfo.position);
  }

  stoneMatchesCurrentPlayerColor(): boolean {
    return this.game.getCurrentPlayer().color === this.getStone()?.player.color;
  }

  getStone(): Stone | undefined {
    return this.game.getBoardStone(this.nodeInfo.position)
  }

}
