import {UserMove} from "../types/Types";
import {PutDownStoneAction} from "./PutDownStoneAction";
import {MoveStoneAction} from "./MoveStoneAction";
import {RemoveStoneAction} from "./RemoveStoneAction";

export class MoveHistory {
  moves: UserMove[];
  currentIndex: number;

  constructor(moves?: UserMove[], currentIndex?: number) {
    this.moves = moves ? moves : [];
    this.currentIndex = currentIndex ? currentIndex : -1;
  }

  getPreviousMove(): UserMove | undefined {
    if (this.currentIndex < 0) return undefined;

    return this.moves[this.currentIndex];
  }

  getNextMove(): UserMove | undefined {
    if (this.currentIndex >= this.moves.length) return undefined;

    return this.moves[this.currentIndex + 1];
  }

  push(move: UserMove): void {
    // if new move equals the existing next move, just increment current index
    if (this.isNewMoveEqualToExisting(move)) {
      console.log("Move is equal to next move:", move, this.getNextMove());
      this.currentIndex += 1;
    } else {
      console.log("Move is NOT equal to next move:", move, this.getNextMove());
      this.resetIndexIfRedoChainIsBroken();
      this.moves.push(move);
      this.currentIndex += 1;
    }

    console.log("push, moves:", this.moves);
    console.log("index: ", this.currentIndex);
  }

  moveIndexForward(): void {
    if (this.moves.length <= this.currentIndex + 1) return;

    this.currentIndex += 1;
    console.log("moveIndexForward, moves:", this.moves);
    console.log("index: ", this.currentIndex);
  }

  moveIndexBack(): void {
    if (this.currentIndex - 1 < -1) return;

    this.currentIndex -= 1;
    console.log("moveBackIndex, moves:", this.moves);
    console.log("index: ", this.currentIndex);
  }

  isNewMoveEqualToExisting(move: UserMove): boolean {
    const nextMove = this.getNextMove();

    if (nextMove instanceof PutDownStoneAction && move instanceof PutDownStoneAction) {
      return move.isEqual(nextMove);
    } else if (nextMove instanceof MoveStoneAction && move instanceof MoveStoneAction) {
      return move.isEqual(nextMove);
    } else if (nextMove instanceof RemoveStoneAction && move instanceof RemoveStoneAction) {
      return move.isEqual(nextMove);
    }

    return false;
  }

  private resetIndexIfRedoChainIsBroken(): void {
    if (this.currentIndex === 0 && this.moves.length > 1) {
      this.moves = this.moves.slice(this.currentIndex, 1);
    }
    else if (this.currentIndex !== this.moves.length - 1) {
      console.log(`slicing from 0 to ${this.currentIndex + 1}`)
      this.moves = this.moves.slice(0, this.currentIndex + 1);
      this.currentIndex = this.moves.length - 1;
    }
  }
}
