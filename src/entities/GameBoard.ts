import { GAME_CONFIG } from '../config/gameConfig';
import { Position } from '../types/game.types';

export class GameBoard {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvasId: string) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
      throw new Error('Canvas element not found');
    }
    this.canvas = canvas;
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get 2D context');
    }
    this.ctx = ctx;
    this.canvas.width = GAME_CONFIG.CANVAS.WIDTH;
    this.canvas.height = GAME_CONFIG.CANVAS.HEIGHT;
  }

  clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawSnake(segments: Position[]): void {
    this.ctx.fillStyle = GAME_CONFIG.COLORS.SNAKE;
    segments.forEach(segment => {
      this.ctx.fillRect(
        segment.x * GAME_CONFIG.CANVAS.GRID_SIZE,
        segment.y * GAME_CONFIG.CANVAS.GRID_SIZE,
        GAME_CONFIG.CANVAS.GRID_SIZE - 1,
        GAME_CONFIG.CANVAS.GRID_SIZE - 1
      );
    });
  }

  drawFood(position: Position): void {
    this.ctx.fillStyle = GAME_CONFIG.COLORS.FOOD;
    this.ctx.fillRect(
      position.x * GAME_CONFIG.CANVAS.GRID_SIZE,
      position.y * GAME_CONFIG.CANVAS.GRID_SIZE,
      GAME_CONFIG.CANVAS.GRID_SIZE - 1,
      GAME_CONFIG.CANVAS.GRID_SIZE - 1
    );
  }

  isOutOfBounds(position: Position): boolean {
    return (
      position.x < 0 ||
      position.x >= this.canvas.width / GAME_CONFIG.CANVAS.GRID_SIZE ||
      position.y < 0 ||
      position.y >= this.canvas.height / GAME_CONFIG.CANVAS.GRID_SIZE
    );
  }
}