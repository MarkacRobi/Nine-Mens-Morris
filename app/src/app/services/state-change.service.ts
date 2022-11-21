import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {INode} from "../model/interface/INode";

@Injectable({
  providedIn: 'root'
})
export class StateChangeService {

  /**
   * @description - Service responsible for communicating state changes in an event driven fashion
   */

  // Subscription for when game node is hovered
  private onGameNodeHovered = new Subject<INode>();
  onGameNodeHovered$= this.onGameNodeHovered.asObservable();

  // Subscription for when game node is clicked
  private onGameNodeClicked = new Subject<INode>();
  onGameNodeClicked$= this.onGameNodeClicked.asObservable();

  // Subscription for when mouse leaves game node area
  private onGameNodeMouseOut = new Subject<INode>();
  onGameNodeMouseOut$= this.onGameNodeMouseOut.asObservable();

  constructor() { }

  onGameNodeHoveredUpdate(node: INode): void {
    this.onGameNodeHovered.next(node);
  }

  onGameNodeClickedUpdate(node: INode): void {
    this.onGameNodeClicked.next(node);
  }

  onGameNodeMouseoutUpdate(node: INode): void {
    this.onGameNodeMouseOut.next(node);
  }
}
