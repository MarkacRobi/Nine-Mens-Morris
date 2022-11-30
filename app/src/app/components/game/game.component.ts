import {Component, OnDestroy, OnInit} from '@angular/core';
import Phaser from "phaser";
import {Board} from "../../models/class/Board";
import {BoardScene} from "../../models/class/BoardScene";
import {MessagingService} from "../../singleton-services/messaging.service";
import {Subscription} from "rxjs";
import {Game} from "../../models/class/Game";
import {HexColors} from "../../models/enum/HexColors";
import Color = Phaser.Display.Color;
import {ColorAdapter} from "../../adapters/ColorAdapter";
import {StoneAdapter} from "../../adapters/StoneAdapter";
import {FileAdapter} from "../../adapters/FileAdapter";
import {GameFactory} from "../../factories/GameFactory";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html'
})
export class GameComponent implements OnInit, OnDestroy {

  /**
   * GameComponent is a wrapper around visualization and logic of the game
   */

  phaserGame?: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;
  scene: BoardScene;

  onGameNodeHoverSub?: Subscription;
  onGameNodeClickedSub?: Subscription;
  onGameNodeMouseoutSub?: Subscription;

  game: Game = new Game();

  constructor(private messagingService: MessagingService) {
    this.scene = new BoardScene(messagingService);
    this.config = {
      type: Phaser.AUTO,
      parent: "game-area",
      scene: [ this.scene ],
      width: 800,
      height: 800
    };

    // print board test TODO: Remove
    new Board().print()
  }

  ngOnInit() {
    this.initNewGame();
    this.phaserGame = new Phaser.Game(this.config);
    this.registerSubscriptions();
  }

  ngOnDestroy(): void {
    // make sure to unsubscribe in order to prevent memory leaks
    this.onGameNodeHoverSub?.unsubscribe();
    this.onGameNodeClickedSub?.unsubscribe();
    this.onGameNodeMouseoutSub?.unsubscribe()
  }

  onRestartGameClick(): void {
    // init new game object
    this.initNewGame();

    // reset scene
    this.scene.create();
  }

  onSaveClick(): void {
    FileAdapter.saveGameToJsonFile(this.game);
  }

  async handleFileInput(e: Event): Promise<void> {
    const loadedGame = await FileAdapter.handleFileInput(e);
    const newGame = GameFactory.createDeepGameCopy(loadedGame, this.scene)

    this.initNewGame(newGame);
  }

  initNewGame(game?: Game): void {
    this.game = game ? game : new Game();
  }

  registerSubscriptions(): void {
    this.subscribeToGameNodeHoverUpdate();
    this.subscribeToGameNodeClickedUpdate();
    this.subscribeToOnGameNodeMouseoutUpdate();
  }

  getPlayerText(): string {
    if (this.game.currentPlayerHasMill()) {
      return ` to remove ${this.game.isWhiteTurn() ? 'black' : 'white'} stone`;
    } else if (!this.game.stoneBeingMoved && this.game.allPiecesHaveBeenPlaced()) {
      return ` to move ${this.game.isWhiteTurn() ? 'white' : 'black'} stone`;
    }

    return "";
  }

  subscribeToGameNodeHoverUpdate(): void {
    this.onGameNodeHoverSub = this.messagingService.onGameNodeHovered$.subscribe(nodeInfo => {
      // init adapters
      const stoneAdapter = new StoneAdapter(this.game, nodeInfo);

      // stage 2 logic when all pieces have been placed
      if (this.game.allPiecesHaveBeenPlaced()) {
        // if current player has mill (have to remove opponents stone)
        if (this.game.currentPlayerHasMill()) {
          // if position is not empty and user has mill, color hovered stone to RED
          if (stoneAdapter.isPositionOccupied() && stoneAdapter.isOpponentsStoneAtPosition() && stoneAdapter.canRemoveStone()) {
            nodeInfo.node.setFillStyle(Color.HexStringToColor(HexColors.RED).color);
          }
        } else {
          // if stone is being moved, node is neighboor of moving stone and  space is empty -> color it to moved stone color
          if (this.game.stoneBeingMoved && stoneAdapter.isNodeNeighborOfMovingStone() && stoneAdapter.isPositionEmpty()) {
            nodeInfo.node.setFillStyle(Color.HexStringToColor(this.game.getColorOfCurrentPlayer()).color);
          }
          else if (stoneAdapter.canStoneBeMoved() && stoneAdapter.stoneMatchesCurrentPlayerColor()) {
            nodeInfo.node.setFillStyle(Color.HexStringToColor(HexColors.GREEN).color);
          }
        }
      } else {
        // stage 1 logic when pieces have not been placed yet

        // if current player has mill (have to remove opponents stone)
        if (this.game.currentPlayerHasMill()) {
          // if position is occupied and stone is opponents
          if (stoneAdapter.isPositionOccupied() && stoneAdapter.isOpponentsStoneAtPosition() && stoneAdapter.canRemoveStone()) {
            nodeInfo.node.setFillStyle(Color.HexStringToColor(HexColors.RED).color);
          }
        } else {
          // if position is empty, show the current player stone color
          if (stoneAdapter.isPositionEmpty() && this.game.currentPlayerCanPutDownNewStone()) {
            nodeInfo.node.setFillStyle(Color.HexStringToColor(this.game.getColorOfCurrentPlayer()).color);
          }
        }
      }
    })
  }

  subscribeToGameNodeClickedUpdate(): void {
    this.onGameNodeClickedSub = this.messagingService.onGameNodeClicked$.subscribe(nodeInfo => {
      // init adapters for given nodeInfo
      const colorAdapter = new ColorAdapter(nodeInfo, this.game);
      const stoneAdapter = new StoneAdapter(this.game, nodeInfo);

      // only empty position can be used

      // stage 2 logic when all pieces have been placed
      if (this.game.allPiecesHaveBeenPlaced()) {
        // if current player has mill (have to remove opponents stone)
        if (this.game.currentPlayerHasMill()) {
          if (stoneAdapter.isOpponentsStoneAtPosition() && stoneAdapter.canRemoveStone()) {
            // remove stone if user has mill and clicked stone is opponents and can be removed
            this.game.removeStone(nodeInfo);
          }
        } else {
          if (stoneAdapter.isPositionEmpty() && this.game.stoneBeingMoved && stoneAdapter.isNodeNeighborOfMovingStone()) {
            // put down the stone on clicked position if is neighbors, empty and stone is being moved
            this.game.putDownStoneAsMove(nodeInfo.position, nodeInfo);
          }
          // if stone at position is current players stone, remove and require to put it down elsewhere
          else if (!this.game.stoneBeingMoved && stoneAdapter.canStoneBeMoved() && stoneAdapter.isCurrentPlayerStoneAtPosition()) {
            this.game.removeStoneToBeMoved(nodeInfo);
          }
        }
      } else {
        // stage 1 logic when there a pieces left to be put down

        // if there is no stone on the position put it down
        if (!this.game.currentPlayerHasMill() && stoneAdapter.isPositionEmpty() && this.game.currentPlayerCanPutDownNewStone()) {
          // put down the stone on clicked position
          this.game.putDownStone(nodeInfo.position, nodeInfo);
        }
        else if (this.game.currentPlayerHasMill() && stoneAdapter.isOpponentsStoneAtPosition() && stoneAdapter.canRemoveStone()) {
          // remove stone if user has mill and clicked stone is opponents
          this.game.removeStone(nodeInfo);
        }
      }
    })
  }

  subscribeToOnGameNodeMouseoutUpdate(): void {
    this.onGameNodeMouseoutSub = this.messagingService.onGameNodeMouseOut$.subscribe(nodeInfo => {
      // init adapters for given nodeInfo
      const colorAdapter = new ColorAdapter(nodeInfo, this.game);
      const stoneAdapter = new StoneAdapter(this.game, nodeInfo);

      // if position is empty, reset node color
      if (stoneAdapter.isPositionEmpty()) {
        colorAdapter.resetNodeColor();
      } else {
        // reset color to current stone color
        colorAdapter.setColorBasedOnStone();
      }
    })
  }

}
