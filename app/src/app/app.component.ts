import {Component, OnInit} from '@angular/core';
import Phaser from 'phaser';
import {Board} from "./model/class/Board";

class NewScene extends Phaser.Scene {

  constructor() {
    super({ key: 'new' });
  }

  preload() {
    console.log('enter preload');
  }

  create() {
    console.log('enter create');
  }
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  phaserGame?: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;

  constructor() {
    this.config = {
      type: Phaser.AUTO,
      scene: [ NewScene ],
      physics: {
        default: 'arcade',
      },
      scale: {
        mode: Phaser.Scale.FIT,
        parent: 'gameContainer',
        width: 800,
        height: 600
      }
    };

    // print board test TODO: Remove
    new Board().print()
  }

  ngOnInit() {
    this.phaserGame = new Phaser.Game(this.config);
  }

}
