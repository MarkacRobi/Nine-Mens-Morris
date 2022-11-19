import { Component, OnInit } from '@angular/core';
import Phaser from "phaser";
import {Board} from "../../model/class/Board";
import {BoardScene} from "../../model/class/BoardScene";

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html'
})
export class GameBoardComponent implements OnInit {

  phaserGame?: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;

  constructor() {
    this.config = {
      type: Phaser.AUTO,
      scene: [ BoardScene ],
      physics: {
        default: 'arcade',
      },
      scale: {
        mode: Phaser.Scale.FIT,
        parent: 'gameContainer',
        width: 1078,
        height: 1077
      }
    };

    // print board test TODO: Remove
    new Board().print()
  }

  ngOnInit() {
    this.phaserGame = new Phaser.Game(this.config);
  }

}
