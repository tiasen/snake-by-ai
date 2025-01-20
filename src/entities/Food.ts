import { GAME_CONFIG } from '../config/gameConfig';
import { Position } from '../types/game.types';
import { ISnake } from '../interfaces/game.interfaces';
import { IFood } from '../interfaces/game.interfaces';

export class Food implements IFood {
  private position: Position;

  constructor() {
    this.position = this.generatePosition();
  }

  generatePosition(snake?: ISnake): Position {
    const maxX = GAME_CONFIG.CANVAS.WIDTH / GAME_CONFIG.CANVAS.GRID_SIZE - 1;
    const maxY = GAME_CONFIG.CANVAS.HEIGHT / GAME_CONFIG.CANVAS.GRID_SIZE - 1;

    while (true) {
      const position = {
        x: Math.floor(Math.random() * maxX),
        y: Math.floor(Math.random() * maxY)
      };

      if (!snake || !snake.collidesWithSelf(position)) {
        return position;
      }
    }
  }

  getPosition(): Position {
    return this.position;
  }

  regenerate(snake: ISnake): void {
    this.position = this.generatePosition(snake);
  }
}