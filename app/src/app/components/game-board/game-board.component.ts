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
      parent: "game-area",
      scene: [ BoardScene ],
      width: 800,
      height: 800
    };

    // print board test TODO: Remove
    new Board().print()
  }

  ngOnInit() {
    this.phaserGame = new Phaser.Game(this.config);
  }

}
