import { Component, OnInit, Input } from '@angular/core';

export enum State {
  ALIVE = 1,
  DEAD = 0,
}

@Component({
  selector: 'cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class Cell implements OnInit {
  @Input() coord: Coord;
  @Input() state: State;
  @Input() length?: number;
  @Input() width?: number;

  ngOnInit() {
    if (!this.length) {
      this.length = 1;
    }
    if (!this.width) {
      this.width = 1;
    }
  }

  get color(): string {
    if (this.state == State.ALIVE) {
      return 'black';
    }
    return 'white';
  }
}

export class Coord {
  constructor(public x: number, public y: number) {}
}
