import {BoardFigure} from "../enum/BoardFigure";

export class BoardPosition {
  figure: BoardFigure;
  position: number; // must be >=0 and < 24


  constructor(position: number, figure?: BoardFigure) {
    this.figure = figure ? figure : BoardFigure.EMPTY;
    this.position = position;
  }

  updateFigure(newFigure: BoardFigure) {
    this.figure = newFigure
  }
}
