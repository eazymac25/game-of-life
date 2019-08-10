import { Component } from '@angular/core';

import { State, Coord } from './cell/cell.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'game-of-life';

  coord = new Coord(1, 1);
  state = State.DEAD;
}
