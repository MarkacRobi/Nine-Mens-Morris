import Phaser from "phaser";
import {HexColors} from "../enum/HexColors";
import Pointer = Phaser.Input.Pointer;
import Color = Phaser.Display.Color;

export class BoardScene extends Phaser.Scene {

  /**
   * @description BoardScene class contains logic for displaying scene as well as handlers for interactions (e.g. mouse)
   */

  constructor() {
    super({ key: 'new' });
  }

  preload() {
    console.log('enter preload');
    this.load.image("board", "assets/images/scene/board.png");
  }

  create() {
    console.log('enter create');
    const board = this.add.image(this.scale.width/2,this.scale.height/2, 'board').setInteractive();

    /**
     * Initialise clickable points on the board
     */

    const circleRadius = 40;

    // assign circles to board nodes in same data structure as board game positions
    // i.e. boardNodes[index] returns node
    const boardNodes = [
      this.add.circle(125, 122, circleRadius).setInteractive(), // 0,0
      this.add.circle(537, 122, circleRadius).setInteractive(), // 0,1
      this.add.circle(952, 122, circleRadius).setInteractive(), // 0,2
      this.add.circle(125, 535, circleRadius).setInteractive(), // 0,3
      this.add.circle(952, 535, circleRadius).setInteractive(), // 0,4
      this.add.circle(122, 952, circleRadius).setInteractive(), // 0,5
      this.add.circle(537, 952, circleRadius).setInteractive(), // 0,6
      this.add.circle(952, 952, circleRadius).setInteractive(), // 0,7
      this.add.circle(233, 231, circleRadius).setInteractive(), // 0,8
      this.add.circle(537, 231, circleRadius).setInteractive(), // 0,9
      this.add.circle(843, 231, circleRadius).setInteractive(), // 1,0
      this.add.circle(233, 537, circleRadius).setInteractive(), // 1,1
      this.add.circle(842, 537, circleRadius).setInteractive(), // 1,2
      this.add.circle(233, 840, circleRadius).setInteractive(), // 1,3
      this.add.circle(537, 839, circleRadius).setInteractive(), // 1,4
      this.add.circle(843, 841, circleRadius).setInteractive(), // 1,5
      this.add.circle(358, 357, circleRadius).setInteractive(), // 1,6
      this.add.circle(537, 357, circleRadius).setInteractive(), // 1,7
      this.add.circle(717, 357, circleRadius).setInteractive(), // 1,8
      this.add.circle(357, 537, circleRadius).setInteractive(), // 1,9
      this.add.circle(716, 537, circleRadius).setInteractive(), // 2,0
      this.add.circle(357, 714, circleRadius).setInteractive(), // 2,1
      this.add.circle(537, 714, circleRadius).setInteractive(), // 2,2
      this.add.circle(712, 714, circleRadius).setInteractive(), // 2,3
    ];

    // init node mouse event handlers
    boardNodes.forEach((node, index) => {

      // on hover node
      node.on('pointerover', (pointer: Pointer) => {
        // color node to black
        node.setFillStyle(Color.HexStringToColor(HexColors.BLACK).color);

        /**
         * TODO:
         * - IF node is EMPTY, show color of current player figures
         * - IF node is not empty, do nothing
         */
      });

      // on click node
      node.on('pointerdown', (pointer: Pointer) => {
        console.log(`rectangle ${index} clicked`);

        /**
         * TODO:
         * - IF node is EMPTY, place current player color figure
         * - IF node is NOT EMPTY and enemy player color figure is placed, check if current player can eliminate figure
         */
      });

      // on pointer leaving node area
      node.on("pointerout", (pointer: Pointer) => {
        // handle mouse leaving game object

        // reset color
        node.setFillStyle();

        /**
         * TODO:
         * - IF node is EMPTY, reset color with "node.setFillStyle();"
         */
      })
    });
  }

  handler(shape: any, x: any, y: any, gameObject: any): boolean {
    if (shape.radius > 0 && x >= shape.left && x <= shape.right && y >= shape.top && y <= shape.bottom) {
      const dx = (shape.x - x) * (shape.x - x);
      const dy = (shape.y - y) * (shape.y - y);

      return (dx + dy) <= (shape.radius * shape.radius);
    } else {
      return false;
    }
  }
}
