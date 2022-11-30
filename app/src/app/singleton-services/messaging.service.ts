import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {INode} from "../models/interface/INode";

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  /**
   * @description A Singleton Service responsible for communicating UI and data state changes in an event driven fashion
   *              using rxjs Observer
   */

  // Observable for when game node is hovered
  private onGameNodeHovered = new Subject<INode>();
  onGameNodeHovered$= this.onGameNodeHovered.asObservable();

  // Observable for when game node is clicked
  private onGameNodeClicked = new Subject<INode>();
  onGameNodeClicked$= this.onGameNodeClicked.asObservable();

  // Observable for when mouse leaves game node area
  private onGameNodeMouseOut = new Subject<INode>();
  onGameNodeMouseOut$= this.onGameNodeMouseOut.asObservable();

  constructor() { }

  // push message of game node being hovered
  onGameNodeHoveredUpdate(node: INode): void {
    this.onGameNodeHovered.next(node);
  }

  // push message of game node being clicked
  onGameNodeClickedUpdate(node: INode): void {
    this.onGameNodeClicked.next(node);
  }

  // push message of game node being left by mouse
  onGameNodeMouseoutUpdate(node: INode): void {
    this.onGameNodeMouseOut.next(node);
  }
}
