import Phaser from "phaser";
import {MessagingService} from "../../singleton-services/messaging.service";
import Arc = Phaser.GameObjects.Arc;
import {BOARD_HEIGHT, BOARD_WIDTH, NODE_CIRCLE_RADIUS} from "../../constants";

export class BoardScene extends Phaser.Scene {

  /**
   * @description BoardScene class contains logic for displaying scene as well as handlers for interactions (e.g. mouse)
   */

  boardNodes?: Arc[];

  constructor(private messagingService: MessagingService) {
    super({ key: 'new' });
  }

  preload() {
    this.load.image("board", "assets/images/scene/board.png");
  }

  create() {
    const board = this.add.image(this.scale.width/2,this.scale.height/2, 'board').setInteractive();
    board.setDisplaySize(BOARD_WIDTH, BOARD_HEIGHT);

    /**
     * @description Assign circles to board nodes in same data structure as board game positions
     *              i.e. boardNodes[position] returns node where "position" is one of 00, 01, ..
     */
    this.boardNodes = [
      this.add.circle(93, 90, NODE_CIRCLE_RADIUS).setInteractive(), // 0,0
      this.add.circle(400, 90, NODE_CIRCLE_RADIUS).setInteractive(), // 0,1
      this.add.circle(707, 90, NODE_CIRCLE_RADIUS).setInteractive(), // 0,2
      this.add.circle(93, 400, NODE_CIRCLE_RADIUS).setInteractive(), // 0,3
      this.add.circle(707, 400, NODE_CIRCLE_RADIUS).setInteractive(), // 0,4
      this.add.circle(90, 707, NODE_CIRCLE_RADIUS).setInteractive(), // 0,5
      this.add.circle(400, 707, NODE_CIRCLE_RADIUS).setInteractive(), // 0,6
      this.add.circle(707, 707, NODE_CIRCLE_RADIUS).setInteractive(), // 0,7
      this.add.circle(172, 172, NODE_CIRCLE_RADIUS).setInteractive(), // 0,8
      this.add.circle(400, 172, NODE_CIRCLE_RADIUS).setInteractive(), // 0,9
      this.add.circle(626, 172, NODE_CIRCLE_RADIUS).setInteractive(), // 1,0
      this.add.circle(172, 400, NODE_CIRCLE_RADIUS).setInteractive(), // 1,1
      this.add.circle(626, 400, NODE_CIRCLE_RADIUS).setInteractive(), // 1,2
      this.add.circle(172, 626, NODE_CIRCLE_RADIUS).setInteractive(), // 1,3
      this.add.circle(400, 626, NODE_CIRCLE_RADIUS).setInteractive(), // 1,4
      this.add.circle(626, 626, NODE_CIRCLE_RADIUS).setInteractive(), // 1,5
      this.add.circle(266, 266, NODE_CIRCLE_RADIUS).setInteractive(), // 1,6
      this.add.circle(400, 266, NODE_CIRCLE_RADIUS).setInteractive(), // 1,7
      this.add.circle(532, 266, NODE_CIRCLE_RADIUS).setInteractive(), // 1,8
      this.add.circle(266, 400, NODE_CIRCLE_RADIUS).setInteractive(), // 1,9
      this.add.circle(532, 400, NODE_CIRCLE_RADIUS).setInteractive(), // 2,0
      this.add.circle(266, 530, NODE_CIRCLE_RADIUS).setInteractive(), // 2,1
      this.add.circle(400, 530, NODE_CIRCLE_RADIUS).setInteractive(), // 2,2
      this.add.circle(532, 530, NODE_CIRCLE_RADIUS).setInteractive(), // 2,3
    ];

    /**
     * @description Initialise pointer event handlers for each board node/position
     */
    this.boardNodes.forEach((node, index) => {
      // on hover node
      node.on('pointerover', () => this.messagingService.onGameNodeHoveredUpdate({node, position: index}));

      // on click node
      node.on('pointerdown', () => this.messagingService.onGameNodeClickedUpdate({node, position: index}));

      // on pointer leaving node area
      node.on('pointerout', () => this.messagingService.onGameNodeMouseoutUpdate({node, position: index}));
    });
  }

  /**
   * @description Get Phaser Arc object of node at given position
   */
  getArc(position: number): Arc | undefined {
    return this.boardNodes ? this.boardNodes[position] : undefined;
  }
}
