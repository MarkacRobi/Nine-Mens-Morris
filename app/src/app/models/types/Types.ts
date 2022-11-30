import {PutDownStoneAction} from "../class/PutDownStoneAction";
import {MoveStoneAction} from "../class/MoveStoneAction";
import {RemoveStoneAction} from "../class/RemoveStoneAction";

/**
 * Types file exports useful types
 */

export type UserMove = PutDownStoneAction | MoveStoneAction | RemoveStoneAction;
