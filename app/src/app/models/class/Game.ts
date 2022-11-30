import {Board} from "./Board";
import {Stone} from "./Stone";
import {BOARD_NODES_SIZE, boardNeighbors, possibleMillPerPosition, STONES_PER_PLAYER} from "../../constants";
import {INode} from "../interface/INode";
import {HexColors} from "../enum/HexColors";
import {StoneFactory} from "../../factories/StoneFactory";
import {Player} from "./Player";
import {PlayerFactory} from "../../factories/PlayerFactory";
import {PutDownStoneAction} from "./PutDownStoneAction";
import {MoveHistory} from "./MoveHistory";
import {MoveStoneAction} from "./MoveStoneAction";
import {RemoveStoneAction} from "./RemoveStoneAction";

export class Game {

  /**
   * @description Game object represents an entity holding all information about a specific game
   */

  // board associated with this game
  public board: Board;

  public whitePlayer: Player;
  public blackPlayer: Player;
  public playerTurn: Player;
  public stoneBeingMoved?: Stone;
  public gameOver: boolean;
  public gameWinner?: Player;
  public moveHistory: MoveHistory;

  constructor() {
    // default init state
    this.board = new Board();
    this.moveHistory = new MoveHistory();
    this.whitePlayer = PlayerFactory.createWhitePlayer();
    this.blackPlayer = PlayerFactory.createBlackPlayer();
    this.playerTurn = this.whitePlayer; // default start with white player
    this.gameOver = false;
    this.gameWinner = undefined;
  }

  /**
   * @description Initialise values of the game. Used in load game logic.
   */
  initValues(board: Board, moveHistory: MoveHistory, whitePlayer: Player, blackPlayer: Player, playerTurn: Player,
             gameOver: boolean, stoneBeingMoved?: Stone, gameWinner?: Player): void {
    this.board = board;
    this.moveHistory = moveHistory;
    this.whitePlayer = whitePlayer;
    this.blackPlayer = blackPlayer;
    this.playerTurn = playerTurn;
    this.stoneBeingMoved = stoneBeingMoved;
    this.gameOver = gameOver;
    this.gameWinner = gameWinner
  }

  /**
   * @description Handle back button click by reversing user action based on the move history
   */
  onBackClick(): void {
    const lastMove = this.moveHistory.getPreviousMove();

    if (lastMove == undefined) return;

    if (lastMove instanceof PutDownStoneAction) {
      this.reversePutDownStone(lastMove);
    } else if (lastMove instanceof MoveStoneAction) {
      this.reverseMoveStone(lastMove);
    } else {
      this.reverseRemoveStone(lastMove);
    }

    this.moveHistory.moveIndexBack();

    console.log("Player turn after back clicked = " + (this.isWhiteTurn() ? "WHITE" : "BLACK"));
  }

  /**
   * @description Handle next button click by re-doing user action based on the move history
   */
  onNextClick(): void {
    const lastMove = this.moveHistory.getNextMove();

    if (lastMove == undefined) return;

    if (lastMove instanceof PutDownStoneAction) {
      this.redoPutDownStone(lastMove);
    } else if (lastMove instanceof MoveStoneAction) {
      this.redoPutDownStoneAsMove(lastMove);
    } else {
      this.removeStone(lastMove.stone.node, true);
    }

    console.log("Player turn after back clicked = " + (this.isWhiteTurn() ? "WHITE" : "BLACK"));
  }

  /**
   * @description Put stone on board logic
   */
  putDownStone(position: number, nodeInfo: INode): void {
    // check if position is occupied
    if (this.board.isPositionOccupied(position)) {
      throw new Error(`[putDownStone] position=${position} already occupied by ${this.board.getStone(position)}!`);
    }

    // place stone based on the player turn
    const stone = StoneFactory.createStoneBasedOnPlayerTurn(this.playerTurn, position, nodeInfo);
    this.board.putDownStone(position, stone);

    // color node
    stone.colorNode();

    // increment/decrement counters
    this.updateStonesForPutDownStone(stone);

    let userHasMill;
    // check if user has new mill
    if (this.currentPlayerHasNewMill(position) && !this.opponentStonesAreAllInMill()) {
      this.setPlayerMill();
      userHasMill = true;
    } else {
      // switch player turns at the end if no mill was found
      this.switchPlayerTurn();
      userHasMill = false;
    }

    // push put down action to move history
    this.moveHistory.push(new PutDownStoneAction(stone, userHasMill));

    // at the end of action check if game is over
    this.checkIfGameOver();
  }

  /**
   * @description Re-do put down stone action logic
   */
  redoPutDownStone(action: PutDownStoneAction): void {
    const stone = action.stone;
    this.board.putDownStone(stone.position, stone);

    // re-color node
    stone.colorNode();

    // increment/decrement counters
    this.updateStonesForPutDownStone(stone);

    // check if user has new mill
    if (this.currentPlayerHasNewMill(stone.position) && !this.opponentStonesAreAllInMill()) {
      this.setPlayerMill();
    } else {
      // switch player turns at the end if no mill was found
      this.switchPlayerTurn();
    }

    this.moveHistory.moveIndexForward();

    // at the end of action check if game is over
    this.checkIfGameOver();
  }

  /**
   * @description Reverse put stone on board logic
   */
  reversePutDownStone(move: PutDownStoneAction): void {
    // remove stone from board
    this.board.removeStone(move.stone.position);

    // reset color
    move.stone.resetColor();

    // reverse user stone counters
    this.reverseUpdateStonesForPutDownStone(move.stone);

    // reverse turn to the player that put down the stone
    this.playerTurn = move.stone.player;

    // set mill to false
    this.resetMill();

    // reset check if game is over
    this.checkIfGameOver();
  }

  /**
   * @description Put down stone in context of moving existing stone logic
   */
  putDownStoneAsMove(position: number, node: INode) {
    // check if position is occupied
    if (this.board.isPositionOccupied(position)) {
      throw new Error(`[putDownStone] position=${position} already occupied by ${this.board.getStone(position)}!`);
    }

    // place stone based on the player turn
    const stone = StoneFactory.createStoneBasedOnPlayerTurn(this.playerTurn, position, node);
    this.board.putDownStone(position, stone)
    stone.colorNode();

    // check if user has new mill
    let userHasMill;
    if (this.currentPlayerHasNewMill(position) && !this.opponentStonesAreAllInMill()) {
      this.setPlayerMill();
      userHasMill = true;
    } else {
      // switch player turns at the end if no mill was found
      this.switchPlayerTurn();
      userHasMill = false;
    }

    const move = this.moveHistory.getPreviousMove();

    if (move instanceof MoveStoneAction) {
      move.setPutDownStone(stone);
      move.userHasNewMill = userHasMill;
    } else {
      throw new Error("[putDownStoneAsMove] previous action is not MoveStoneAction!")
    }

    // put stone being moved flag to false
    this.stoneBeingMoved = undefined;

    // at the end of action check if game is over
    this.checkIfGameOver();
  }

  /**
   * @description Re-do put down stone in context of moving stone logic
   */
  redoPutDownStoneAsMove(action: MoveStoneAction) {
    const stone = action.putDownStone!;
    this.board.putDownStone(stone.position, stone)
    stone.colorNode();

    this.board.removeStone(action.removedStone.position);
    action.removedStone.resetColor();

    this.playerTurn = stone.player;

    // check if user has new mill
    let userHasMill;
    if (this.currentPlayerHasNewMill(stone.position) && !this.opponentStonesAreAllInMill()) {
      this.setPlayerMill();
      userHasMill = true;
    } else {
      // switch player turns at the end if no mill was found
      this.switchPlayerTurn();
      userHasMill = false;
    }

    action.userHasNewMill = userHasMill;

    // put stone being moved flag to false
    this.stoneBeingMoved = undefined;

    this.moveHistory.moveIndexForward();

    // at the end of action check if game is over
    this.checkIfGameOver();
  }

  /**
   * @description Reverse moved stone logic
   */
  reverseMoveStone(action: MoveStoneAction): void {
    // remove put down stone from the board
    this.board.removeStone(action.putDownStone!.position);

    // put stone back down
    this.board.putDownStone(action.moveFromPosition, action.removedStone);

    // re-color removed stone
    action.removedStone.colorNode();

    // reset moved stone position
    action.putDownStone?.resetColor();

    // assign current player to be the one that removed the stone (opponent)
    this.playerTurn = action.removedStone.player;

    // reset check if game is over
    this.checkIfGameOver();
  }

  /**
   * @description Remove stone from the board (i.e. user has mill)
   */
  removeStone(nodeInfo: INode, nextClicked = false) {
    // check if position is empty
    if (this.board.isPositionEmpty(nodeInfo.position)) {
      throw new Error(`[removeStone] position=${nodeInfo.position} is empty!`);
    }

    // remove stone from board position
    const stone = this.getBoardStone(nodeInfo.position)!;
    this.board.removeStone(nodeInfo.position);

    // increments stones lost counter
    this.isWhiteTurn() ? this.blackPlayer.lostStone() : this.whitePlayer.lostStone();

    // remove color
    nodeInfo.node.setFillStyle();

    // reset mill flags
    this.resetMill();

    if (nextClicked) {
      this.moveHistory.moveIndexForward();
    } else {
      this.moveHistory.push(new RemoveStoneAction(stone))
    }

    // switch turn after stone is removed
    this.switchPlayerTurn()

    // at the end of action check if game is over
    this.checkIfGameOver();
  }

  /**
   * @description Reverse removed stone logic
   */
  reverseRemoveStone(action: RemoveStoneAction) {
    // put stone back down
    this.board.putDownStone(action.stone.position, action.stone);

    // re-color removed stone
    action.stone.colorNode();

    // assign current player to be the one that removed the stone (opponent)
    if (action.stone.player.isWhite()) {
      this.whitePlayer.reverseRemoveStone();
      this.playerTurn = this.blackPlayer;
    } else {
      this.blackPlayer.reverseRemoveStone();
      this.playerTurn = this.whitePlayer;
    }

    // re-init mill of the opponent player
    this.playerTurn.hasActiveMill = true;


    // at the end of action check if game is over
    this.checkIfGameOver();
  }

  /**
   * @description Remove stone in context of moving it logic
   */
  removeStoneToBeMoved(nodeInfo: INode) {
    // check if position is empty
    if (this.board.isPositionEmpty(nodeInfo.position)) {
      throw new Error(`[removeStone] position=${nodeInfo.position} is empty!`);
    }

    // assign stone being moved
    this.stoneBeingMoved = this.board.getStone(nodeInfo.position);

    // remove stone from board position
    this.board.removeStone(nodeInfo.position);

    // remove color
    nodeInfo.node.setFillStyle();

    this.moveHistory.push(new MoveStoneAction(this.stoneBeingMoved!, false, nodeInfo.position));
  }

  /**
   * @description Update players counters in context of put down stone action
   */
  updateStonesForPutDownStone(stone: Stone): void {
    // increment/decrement counters based on the put down stone
    stone.isWhite() ? this.whitePlayer.putDownStone() : this.blackPlayer.putDownStone()
  }

  /**
   * @description Reverse players counters in context of reverse put down stone action
   */
  reverseUpdateStonesForPutDownStone(stone: Stone): void {
    // increment/decrement counters based on the put down stone
    stone.isWhite() ? this.whitePlayer.reversePutDownStone() : this.blackPlayer.reversePutDownStone()
  }

  /**
   * @description Reset both player mill flags
   */
  resetMill(): void {
    this.whitePlayer.resetMill();
    this.blackPlayer.resetMill();
  }

  /**
   * @description Set player mill based on the current player turn
   */
  setPlayerMill(): void {
    if (this.isWhiteTurn()) {
      this.whitePlayer.setMill();
    } else {
      this.blackPlayer.setMill();
    }
  }

  /**
   * @description Switch player turn
   */
  switchPlayerTurn(): void {
    this.playerTurn = this.isWhiteTurn() ? this.blackPlayer : this.whitePlayer;
  }


  /**
   * Checkers
   */

  /**
   * @description Check if player can move any of its stone to the neighbor position
   */
  canPlayerMove(player: Player): boolean {
    console.log("canPlayerMove player =", player.color);
    console.log()
    for (let position = 0; position < BOARD_NODES_SIZE; position++) {
      // for each player stone check if it can be moved to the neighbor position
      if (this.getBoardStone(position)?.player.color === player.color) {
        for (const neighbor of boardNeighbors[position]) {
          console.log("Checking if neighbor is free at position ", neighbor);
          if (this.isPositionEmpty(neighbor)) {
            // if neighbor position is empty return true
            return true;
          }
          console.log("Neighbor occupied by ", this.getBoardStone(position));
        }
      }
    }

    return false;
  }

  /**
   * @description Trigger logic to check if game is over
   */
  checkIfGameOver(): void {
    this.gameOver = this.isGameOver();
    this.gameWinner = this.getWinner();
  }

  /**
   * @description Boolean flag indicating whether game is over
   */
  isGameOver(): boolean {
    return this.getWinner() !== undefined;
  }

  /**
   * @description Check if it is white's turn
   */
  isWhiteTurn(): boolean {
    return this.playerTurn.isWhite();
  }

  /**
   * @description Check if current player has mill
   */
  currentPlayerHasMill(): boolean {
    return this.getCurrentPlayer().hasActiveMill;
  }

  /**
   * @description Check if stone at position can be removed (i.e. should not be in mill)
   */
  canRemoveStone(position: number): boolean {
    return !this.opponentHasMillAtGivenPosition(position);
  }

  /**
   * @description Check if current player can put down new stone (i.e. has stones left)
   */
  currentPlayerCanPutDownNewStone(): boolean {
    return this.getCurrentPlayer().hasStonesLeft();
  }

  /**
   * @description Check if all pieces have been placed
   */
  allPiecesHaveBeenPlaced(): boolean {
    return !this.whitePlayer.hasStonesLeft() && !this.blackPlayer.hasStonesLeft();
  }

  /**
   * @description Check if current player has new mill
   */
  currentPlayerHasNewMill(lastStonePosition: number): boolean {
    const possibleMills = possibleMillPerPosition[lastStonePosition];
    const mill1 = possibleMills[0];
    const mill2 = possibleMills[1];

    // check if mill1 or mill2 positions are occupied by current player
    return this.playerHasStonesOnPositions(mill1) || this.playerHasStonesOnPositions(mill2);
  }

  /**
   * @description Check if player has stones on given positions
   */
  playerHasStonesOnPositions(positions: number[], player?: Player): boolean {
    return positions.every(position => this.getBoardStone(position)?.player.color === (player !== undefined ? player : this.playerTurn).color);
  }

  /**
   * @description Check if position is empty
   */
  isPositionEmpty(position: number): boolean {
    return this.getBoardStone(position) === undefined;
  }

  /**
   * @description Check if opponents stones are all in mill
   */
  opponentStonesAreAllInMill(): boolean {
    return this.board.board.every(stone => {
      if (stone && stone.player.color === this.getCurrentOpponentPlayer().color) {
        return this.opponentHasMillAtGivenPosition(stone.position)
      }
      return true;
    });
  }

  /**
   * @description Check if opponent has mill at given position
   */
  opponentHasMillAtGivenPosition(position: number): boolean {
    const possibleMills = possibleMillPerPosition[position];
    const mill1 = possibleMills[0];
    const mill2 = possibleMills[1];
    const player = this.getCurrentOpponentPlayer();

    // check if mill1 or mill2 positions are occupied by opponent player
    return this.playerHasStonesOnPositions(mill1, player) || this.playerHasStonesOnPositions(mill2, player);
  }

  /**
   * Getters
   */

  /**
   * @description The game is finished when a played loses, either by having only two pieces left or
   *              by being unable to move. Winner is the player which has > 3 stone left.
   */
  getWinner(): Player | undefined {
    if (!this.board.isEmpty()) {
      if (!this.blackPlayer.hasStonesLeft() && (this.blackPlayer.hasLessThan3StonesOnBoard()
        || !this.canPlayerMove(this.blackPlayer))) {
        console.log("getWinner whitePlayer won!");
        console.log("!this.canPlayerMove(this.blackPlayer) = ", !this.canPlayerMove(this.blackPlayer));
        return this.whitePlayer;
      } else if (!this.whitePlayer.hasStonesLeft() && (this.whitePlayer.hasLessThan3StonesOnBoard()
        || !this.canPlayerMove(this.whitePlayer))) {
        console.log("getWinner blackPlayer won!");
        return this.blackPlayer;
      }
    }

    return undefined;
  }

  getWinnerColorText(): string {
    if (this.gameWinner === undefined) return "";
    return this.gameWinner.isWhite() ? "White" : "Black";
  }

  getColorOfCurrentPlayer(): HexColors {
    return this.isWhiteTurn() ? HexColors.WHITE : HexColors.BLACK;
  }

  getCurrentPlayer(): Player {
    return this.playerTurn;
  }

  getCurrentOpponentPlayer(): Player {
    return this.isWhiteTurn() ? this.blackPlayer : this.whitePlayer;
  }

  getWhiteStonesLost(): number {
    return this.whitePlayer.stonesLost;
  }

  getBlackStonesLost(): number {
    return this.blackPlayer.stonesLost;
  }

  getWhiteStonesOnBoard(): number {
    return this.whitePlayer.stonesOnBoard;
  }

  getBlackStonesOnBoard(): number {
    return this.blackPlayer.stonesOnBoard;
  }

  getWhiteStonesLeft(): number {
    return this.whitePlayer.stonesLeft;
  }

  getBlackStonesLeft(): number {
    return this.blackPlayer.stonesLeft;
  }

  getBoardStone(position: number): Stone | undefined {
    return this.board.board[position];
  }
}
