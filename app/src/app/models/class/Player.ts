import {StoneColor} from "../enum/StoneColor";

export class Player {
  color: StoneColor;
  stonesLeft: number;
  stonesOnBoard: number;
  stonesLost: number;
  hasActiveMill: boolean;

  constructor(color: StoneColor, stonesLeft: number, stonesOnBoard: number, stonesLost: number, hasActiveMill?: boolean) {
    this.color = color;
    this.stonesLeft = stonesLeft;
    this.stonesOnBoard = stonesOnBoard;
    this.stonesLost = stonesLost;
    this.hasActiveMill = hasActiveMill !== undefined ? hasActiveMill : false;
  }

  lostStone(): void {
    this.stonesLost += 1;
    this.stonesOnBoard -= 1;
  }

  putDownStone(): void {
    this.stonesOnBoard += 1;
    this.stonesLeft -= 1;
  }

  reversePutDownStone(): void {
    this.stonesOnBoard -= 1;
    this.stonesLeft += 1;
  }

  reverseRemoveStone(): void {
    this.stonesOnBoard += 1;
    this.stonesLost -= 1;
  }

  resetMill(): void {
    this.hasActiveMill = false;
  }

  setMill(): void {
    this.hasActiveMill = true;
  }

  hasStonesLeft(): boolean {
    return this.stonesLeft > 0;
  }

  hasLessThan3StonesOnBoard(): boolean {
    return this.stonesOnBoard < 3;
  }

  isWhite(): boolean {
    return this.color === StoneColor.WHITE;
  }

  getDeepCopy(): Player {
    return new Player(this.color, this.stonesLeft, this.stonesOnBoard, this.stonesLost, this.hasActiveMill);
  }

  isEqualTo(player: Player): boolean {
    return this.color === player.color
      && this.stonesLeft === player.stonesLeft
      && this.stonesOnBoard === player.stonesOnBoard
      && this.stonesLost === player.stonesLost
      && this.hasActiveMill == player.hasActiveMill
  }

}
