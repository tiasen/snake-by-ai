import { Position, Direction } from '../types/game.types';

export interface ISnake {
  move(newHead: Position): void;
  grow(newHead: Position): void;
  shrink(): void;
  getHead(): Position;
  setDirection(newDirection: Direction): void;
  getDirection(): Direction;
  getSegments(): Position[];
  collidesWithSelf(position: Position): boolean;
  reset(): void;
}

export interface IFood {
  generatePosition(snake?: ISnake): Position;
  getPosition(): Position;
  regenerate(snake: ISnake): void;
}

export interface IGameBoard {
  clear(): void;
  drawSnake(segments: Position[]): void;
  drawFood(position: Position): void;
  isOutOfBounds(position: Position): boolean;
}

export interface IGame {
  start(): void;
  pause(): void;
  reset(): void;
  toggleGame(): void;
}