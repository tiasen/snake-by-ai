import { GAME_CONFIG } from '../config/gameConfig';
import { Position, Direction } from '../types/game.types';
import { ISnake } from '../interfaces/game.interfaces';

export class Snake implements ISnake {
  private segments: Position[];
  private direction: Direction;

  constructor() {
    this.segments = [{ ...GAME_CONFIG.INITIAL_SNAKE.POSITION }];
    this.direction = GAME_CONFIG.INITIAL_SNAKE.DIRECTION;
  }

  move(newHead: Position): void {
    this.segments.unshift(newHead);
  }

  grow(newHead: Position): void {
    this.segments.unshift(newHead);
  }

  shrink(): void {
    this.segments.pop();
  }

  getHead(): Position {
    return this.segments[0];
  }

  setDirection(newDirection: Direction): void {
    this.direction = newDirection;
  }

  getDirection(): Direction {
    return this.direction;
  }

  getSegments(): Position[] {
    return this.segments;
  }

  collidesWithSelf(position: Position): boolean {
    return this.segments.some(segment => 
      segment.x === position.x && segment.y === position.y
    );
  }

  reset(): void {
    this.segments = [{ ...GAME_CONFIG.INITIAL_SNAKE.POSITION }];
    this.direction = GAME_CONFIG.INITIAL_SNAKE.DIRECTION;
  }
}