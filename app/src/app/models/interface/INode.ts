import Arc = Phaser.GameObjects.Arc;

export interface INode {

  /**
   * @description INode interface holds information about position of the node and its associated Phaser Arc object
   */

  node: Arc;
  position: number;
}
