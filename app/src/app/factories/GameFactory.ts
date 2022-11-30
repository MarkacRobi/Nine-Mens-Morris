import {Game} from "../models/class/Game";
import {BoardScene} from "../models/class/BoardScene";
import {BoardFactory} from "./BoardFactory";
import {MoveHistoryFactory} from "./MoveHistoryFactory";
import {PlayerFactory} from "./PlayerFactory";
import {StoneFactory} from "./StoneFactory";

export class GameFactory {
  /**
   * @description Factory responsible for creation of game entities
   */

  public static createDeepGameCopy(game: Game, boardScene: BoardScene): Game {
    const newGame = new Game();
    newGame.initValues(
      BoardFactory.createDeepBoardCopy(game.board, boardScene),
      MoveHistoryFactory.createDeepMoveHistoryCopy(game.moveHistory, boardScene),
      PlayerFactory.createDeepPlayerCopy(game.whitePlayer),
      PlayerFactory.createDeepPlayerCopy(game.blackPlayer),
      PlayerFactory.createDeepPlayerCopy(game.playerTurn),
      game.gameOver,
      game.stoneBeingMoved ? StoneFactory.createDeepStoneCopy(game.stoneBeingMoved, boardScene) : undefined,
      game.gameWinner ? PlayerFactory.createDeepPlayerCopy(game.gameWinner) : undefined
    );

    newGame.board.repaintNodes();

    return newGame;
  }
}
