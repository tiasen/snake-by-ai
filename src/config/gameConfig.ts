import { GameConfig, KeyMappings, OppositeDirections } from '../types/game.types';

export const GAME_CONFIG: GameConfig = {
  CANVAS: {
    ID: 'gameCanvas',
    WIDTH: 600,
    HEIGHT: 400,
    GRID_SIZE: 20
  },
  COLORS: {
    SNAKE: '#4CAF50',
    FOOD: '#FF5722'
  },
  GAME_SPEED: 100,
  SCORE_INCREMENT: 10,
  INITIAL_SNAKE: {
    POSITION: { x: 2, y: 2 },
    DIRECTION: 'right'
  }
};

export const KEY_MAPPINGS: KeyMappings = {
  'ArrowUp': 'up',
  'ArrowDown': 'down',
  'ArrowLeft': 'left',
  'ArrowRight': 'right',
  'w': 'up',
  's': 'down',
  'a': 'left',
  'd': 'right'
};

export const OPPOSITE_DIRECTIONS: OppositeDirections = {
  'up': 'down',
  'down': 'up',
  'left': 'right',
  'right': 'left'
};