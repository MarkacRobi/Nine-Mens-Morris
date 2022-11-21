import Phaser from "phaser";
import {StateChangeService} from "../../services/state-change.service";

export class BoardScene extends Phaser.Scene {

  /**
   * @description BoardScene class contains logic for displaying scene as well as handlers for interactions (e.g. mouse)
   */

  constructor(private stateChangeService: StateChangeService) {
    super({ key: 'new' });
  }

  preload() {
    console.log('enter preload');
    this.load.image("board", "assets/images/scene/board.png");
  }

  create() {
    console.log('enter create');
    const board = this.add.image(this.scale.width/2,this.scale.height/2, 'board').setInteractive();
    board.setDisplaySize(800, 800);

    /**
     * Initialise clickable points on the board
     */

    const circleRadius = 30;

    // assign circles to board nodes in same data structure as board game positions
    // i.e. boardNodes[position] returns node where "position" is one of 00, 01, ..
    const boardNodes = [
      this.add.circle(93, 90, circleRadius).setInteractive(), // 0,0
      this.add.circle(400, 90, circleRadius).setInteractive(), // 0,1
      this.add.circle(707, 90, circleRadius).setInteractive(), // 0,2
      this.add.circle(93, 400, circleRadius).setInteractive(), // 0,3
      this.add.circle(707, 400, circleRadius).setInteractive(), // 0,4
      this.add.circle(90, 707, circleRadius).setInteractive(), // 0,5
      this.add.circle(400, 707, circleRadius).setInteractive(), // 0,6
      this.add.circle(707, 707, circleRadius).setInteractive(), // 0,7
      this.add.circle(172, 172, circleRadius).setInteractive(), // 0,8
      this.add.circle(400, 172, circleRadius).setInteractive(), // 0,9
      this.add.circle(626, 172, circleRadius).setInteractive(), // 1,0
      this.add.circle(172, 400, circleRadius).setInteractive(), // 1,1
      this.add.circle(626, 400, circleRadius).setInteractive(), // 1,2
      this.add.circle(172, 626, circleRadius).setInteractive(), // 1,3
      this.add.circle(400, 626, circleRadius).setInteractive(), // 1,4
      this.add.circle(626, 626, circleRadius).setInteractive(), // 1,5
      this.add.circle(266, 266, circleRadius).setInteractive(), // 1,6
      this.add.circle(400, 266, circleRadius).setInteractive(), // 1,7
      this.add.circle(532, 266, circleRadius).setInteractive(), // 1,8
      this.add.circle(266, 400, circleRadius).setInteractive(), // 1,9
      this.add.circle(532, 400, circleRadius).setInteractive(), // 2,0
      this.add.circle(266, 530, circleRadius).setInteractive(), // 2,1
      this.add.circle(400, 530, circleRadius).setInteractive(), // 2,2
      this.add.circle(532, 530, circleRadius).setInteractive(), // 2,3
    ];

    // init node mouse event handlers
    boardNodes.forEach((node, index) => {

      // on hover node
      node.on('pointerover', () => this.stateChangeService.onGameNodeHoveredUpdate({node, position: index}));

      // on click node
      node.on('pointerdown', () => this.stateChangeService.onGameNodeClickedUpdate({node, position: index}));

      // on pointer leaving node area
      node.on('pointerout', () => this.stateChangeService.onGameNodeMouseoutUpdate({node, position: index}));
    });
  }
}
