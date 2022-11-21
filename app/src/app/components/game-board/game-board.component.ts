import {Component, OnDestroy, OnInit} from '@angular/core';
import Phaser from "phaser";
import {Board} from "../../model/class/Board";
import {BoardScene} from "../../model/class/BoardScene";
import {StateChangeService} from "../../services/state-change.service";
import {Subscription} from "rxjs";
import {Game} from "../../model/class/Game";
import {BoardFigure} from "../../model/enum/BoardFigure";
import {HexColors} from "../../model/enum/HexColors";
import Color = Phaser.Display.Color;

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html'
})
export class GameBoardComponent implements OnInit, OnDestroy {

  phaserGame?: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;
  scene: BoardScene;

  onGameNodeHoverSub?: Subscription;
  onGameNodeClickedSub?: Subscription;
  onGameNodeMouseoutSub?: Subscription;

  game: Game = new Game();

  constructor(private stateChangeService: StateChangeService) {
    this.scene = new BoardScene(stateChangeService);
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
    // make sure to unsubscribe in order to prevent the memory leak
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

  initNewGame(): void {
    this.game = new Game();
  }

  registerSubscriptions(): void {
    this.subscribeToGameNodeHoverUpdate();
    this.subscribeToGameNodeClickedUpdate();
    this.subscribeToOnGameNodeMouseoutUpdate();
  }

  subscribeToGameNodeHoverUpdate(): void {
    this.onGameNodeHoverSub = this.stateChangeService.onGameNodeHovered$.subscribe(nodeInfo => {
      // if position is empty, show the current player stone color
      if (this.game.getBoardFigure(nodeInfo.position) === BoardFigure.EMPTY) {
        const hexColor = this.game.isWhiteTurn() ? HexColors.WHITE : HexColors.BLACK;
        nodeInfo.node.setFillStyle(Color.HexStringToColor(hexColor).color);
      }
    })
  }

  subscribeToGameNodeClickedUpdate(): void {
    this.onGameNodeClickedSub = this.stateChangeService.onGameNodeClicked$.subscribe(nodeInfo => {
      // if game is already being played
      if (this.game.isPlaying()) {
        // check if position is empty
        if (this.game.getBoardFigure(nodeInfo.position) === BoardFigure.EMPTY) {
          this.game.putDownFigure(nodeInfo.position);
        }
      } else {
        // start game
        this.game.startGame();
        this.game.putDownFigure(nodeInfo.position);
      }
    })
  }

  subscribeToOnGameNodeMouseoutUpdate(): void {
    this.onGameNodeMouseoutSub = this.stateChangeService.onGameNodeMouseOut$.subscribe(nodeInfo => {
      // if the node is empty after leaving it, reset the color
      if (this.game.getBoardFigure(nodeInfo.position) === BoardFigure.EMPTY) {
        nodeInfo.node.setFillStyle();
      }
    })
  }

}
