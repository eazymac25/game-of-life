import { Component, OnInit, Input } from '@angular/core';
import { State, Coord } from '../cell/cell.component';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class Board implements OnInit {
  @Input() height: number;
  @Input() width: number;

  frontier = new Set<Life>();
  gameBoard: Array<Array<Life>>;

  ngOnInit() {
    this.initializeBoard();
    this.initializeFrontier();
  }

  /** Initializes the board with a matrix of lives. */
  private initializeBoard(): void {
    let gameBoard = [];
    for (let i=0; i < this.height; i++) {
      gameBoard.push(new Array());
      for (let j=0; j < this.width; j++) {
        const life = new Life(new Coord(i, j), this.generateRandomState());
        gameBoard[i].push(life);
      }
    }
    this.gameBoard = gameBoard;
  }

  /** Loop through the board and find the lives that should exist
  * within the frontier set. */
  private initializeFrontier(): void {
    this.frontier = new Set();
    for (let row of this.gameBoard) {
      for (let life of row) {
        let lifeCount = this.adjacentLife(life);
        if (life.isAlive || this.adjacentLife(life) > 0) {
          life.setLifeCount(lifeCount);
          this.frontier.add(life);
        }
      }
    }
  }

  /** Returns DEAD or ALIVE depending on a random number. */
  private generateRandomState(): State {
    return Math.random() > 0.5 ? State.ALIVE : State.DEAD;
  }

  /** Finds the count of adjacent life for a given life. */
  private adjacentLife(life: Life): number {
    let lifeCount = 0;
    const x = life.coord.x;
    const y = life.coord.y;
    for (let i=-1; i<2; i++) {
      for (let j=-1; j<2; j++) {
        if (x + i < 0 || y + j < 0 ||
          x + i >= this.height ||
          y + j >= this.width || (i == 0 && j == 0)) {
          continue;
        }
        if (this.gameBoard[x+i][y+j].isAlive) {
          lifeCount++;
        }
      }
    }
    return lifeCount;
  }

  /** Called when a user selects "Start Game" and calls iterateLife
  * over an interval. */
  beginGame(): void {
    setInterval(() => {
      this.iterateLife();
    }, 50);
  }

  /** This is a single iteration in the game of life.
  * 1) Update the frontier set by transition life to
  * die, come alive, stay alive, or stay dead.
  * 2) Collect a new frontier set. */
  private iterateLife(): void {
    this.transitionLife(this.frontier);

    let newFrontier = new Set<Life>();
    for (let life of this.frontier) {
      if (life.isAlive) {
        const x = life.coord.x;
        const y = life.coord.y;
        life.setLifeCount(this.adjacentLife(life));
        newFrontier.add(life);
        for (let i=-1; i<2; i++) {
          for (let j=-1; j<2; j++) {
            if (x + i < 0 || y + j < 0 ||
              x + i >= this.height ||
              y + j >= this.width || (i == 0 && j == 0)) {
              continue;
            }
            let currentLife = this.gameBoard[x+i][y+j];
            if (!newFrontier.has(currentLife)) {
              currentLife.setLifeCount(this.adjacentLife(currentLife));
              newFrontier.add(currentLife)
            }
          }
        }
      }
    }
  }

  /**
  * Applies Conway's Game of Life rules over a set of life.
  * This causes cells to either die or live.
  * Upon each call, this updates the board. */
  private transitionLife(lives: Set<Life>): void {
    for (let life of lives) {
      if (life.isAlive && life.nearLife < 2) {
        life.die();
      } else if (life.isAlive && life.nearLife > 3) {
        life.die();
      } else if (life.isDead && life.nearLife == 3) {
        life.live();
      }
    }
  }
}

/** Simple spec for life! */
class Life {
  private nearLifeCount = 0;
  constructor(public coord: Coord,
    public state: State) {}
  
  get isAlive(): boolean {
    return this.state === State.ALIVE;
  }

  get isDead(): boolean {
    return this.state === State.DEAD;
  }

  setLifeCount(lifeCount: number): void {
    this.nearLifeCount = lifeCount;
  }

  get nearLife(): number {
    return this.nearLifeCount;
  }

  die(): void {
    this.state = State.DEAD;
  }

  live(): void {
    this.state = State.ALIVE;
  }
}
