export interface Position {
  x: number;
  y: number;
}

export interface CanvasConfig {
  ID: string;
  WIDTH: number;
  HEIGHT: number;
  GRID_SIZE: number;
}

export interface Colors {
  SNAKE: string;
  FOOD: string;
}

export interface InitialSnake {
  POSITION: Position;
  DIRECTION: Direction;
}

export interface GameConfig {
  CANVAS: CanvasConfig;
  COLORS: Colors;
  GAME_SPEED: number;
  SCORE_INCREMENT: number;
  INITIAL_SNAKE: InitialSnake;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export type KeyMappings = {
  [key: string]: Direction;
};

export type OppositeDirections = {
  [key in Direction]: Direction;
};