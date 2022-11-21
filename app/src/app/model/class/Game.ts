import {GameStatus} from "../enum/GameStatus";
import {Board} from "./Board";
import {PlayerTurn} from "../enum/PlayerTurn";
import {BoardFigure} from "../enum/BoardFigure";
import {BoardPosition} from "./BoardPosition";
import {STONES_PER_PLAYER} from "../../constants";

export class Game {
  /**
   * @description Game object represents an entity holding all information about specific game
   */


  // current status of the game
  private status: GameStatus;

  // board associated with this game
  private readonly board: Board;

  // current player
  private playerTurn: PlayerTurn;

  private whiteStonesLeft: number;
  private blackStonesLeft: number;
  private whiteStonesOnBoard: number;
  private blackStonesOnBoard: number;
  private whiteStonesLost: number;
  private blackStonesLost: number;

  constructor() {
    // default state
    this.status = GameStatus.DEFAULT;
    this.board = new Board();
    this.playerTurn = PlayerTurn.WHITE;
    this.whiteStonesLeft = STONES_PER_PLAYER;
    this.blackStonesLeft = STONES_PER_PLAYER;
    this.whiteStonesOnBoard = 0;
    this.blackStonesOnBoard = 0;
    this.whiteStonesLost = 0;
    this.blackStonesLost = 0;
  }

  getWhiteStonesLost(): number {
    return this.whiteStonesLost;
  }

  getBlackStonesLost(): number {
    return this.blackStonesLost;
  }

  getWhiteStonesOnBoard(): number {
    return this.whiteStonesOnBoard;
  }

  getBlackStonesOnBoard(): number {
    return this.blackStonesOnBoard;
  }

  getWhiteStonesLeft(): number {
    return this.whiteStonesLeft;
  }

  getBlackStonesLeft(): number {
    return this.blackStonesLeft;
  }

  getPlayerTurn(): PlayerTurn {
    return this.playerTurn;
  }

  getBoardPosition(position: number): BoardPosition {
    return this.board.board[position];
  }

  getBoardFigure(position: number): BoardFigure {
    return this.board.board[position].figure;
  }

  startGame(): void {
    this.status = GameStatus.PLAYING;
  }

  // game is played if board is not empty
  isPlaying(): boolean {
    return this.board.isEmpty();
  }

  isWhiteTurn(): boolean {
    return this.playerTurn === PlayerTurn.WHITE;
  }

  putDownFigure(position: number): void {
    // check if position is occupied
    if (this.board.board[position].figure !== BoardFigure.EMPTY) {
      throw new Error(`[putDownFigure] position=${position} already occupied by ${this.board.board[position].figure}!`);
    }

    // place stone based on the player turn
    const newFigure = this.isWhiteTurn() ? BoardFigure.WHITE_PIECE: BoardFigure.BLACK_PIECE;
    this.board.board[position].updateFigure(newFigure);

    // increment counters
    if (this.isWhiteTurn()) {
      this.whiteStonesOnBoard += 1;
      this.whiteStonesLeft -= 1;
    } else {
      this.blackStonesOnBoard += 1;
      this.blackStonesLeft -= 1;
    }

    // switch player turns at the end
    this.switchPlayerTurn();
  }

  switchPlayerTurn(): void {
    this.playerTurn = this.isWhiteTurn() ? PlayerTurn.BLACK : PlayerTurn.WHITE;
  }
}
