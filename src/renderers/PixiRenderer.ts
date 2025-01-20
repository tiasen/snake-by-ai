import * as PIXI from 'pixi.js';
import { GAME_CONFIG } from '../config/gameConfig';
import { Position } from '../types/game.types';
import { IPixiRender } from '../interfaces/render.interfaces';

export class PixiRenderer implements IPixiRender {
  private app: PIXI.Application;
  private gridSize: number;
  private snakeContainer: PIXI.Container;
  private foodSprite: PIXI.Graphics | null = null;
  private graphicsPool: PIXI.Graphics[] = [];

  constructor(canvasId: string) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
      throw new Error('Canvas element not found');
    }

    this.app = new PIXI.Application();
    this.gridSize = GAME_CONFIG.CANVAS.GRID_SIZE;
    this.snakeContainer = new PIXI.Container();
  }

  async initialize(): Promise<void> {
    if (!this.app) {
      throw new Error('PIXI Application not properly initialized');
    }

    await this.app.init({
      view: document.getElementById(GAME_CONFIG.CANVAS.ID) as HTMLCanvasElement,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      width: GAME_CONFIG.CANVAS.WIDTH,
      height: GAME_CONFIG.CANVAS.HEIGHT,
      background: '#000000',
      antialias: true,
      hello: true
    });

    this.app.stage.addChild(this.snakeContainer);
    this.setDimensions(GAME_CONFIG.CANVAS.WIDTH, GAME_CONFIG.CANVAS.HEIGHT);
  }



  setGridSize(size: number): void {
    this.gridSize = size;
  }

  setDimensions(width: number, height: number): void {
    if (!this.app || !this.app.renderer) {
      throw new Error('Cannot resize: PIXI Application not properly initialized');
    }
    this.app.renderer.resize(width, height);
    this.app.stage.hitArea = new PIXI.Rectangle(0, 0, width, height);
  }

  initShaders(): void {
    // Pixi.js handles shaders internally
  }

  createBuffers(): void {
    // Pixi.js handles buffers internally
  }

  clear(): void {
    this.snakeContainer.removeChildren();
    if (this.foodSprite) {
      this.foodSprite.destroy();
      this.foodSprite = null;
    }
  }

  private getGraphicsFromPool(): PIXI.Graphics {
    return this.graphicsPool.pop() || new PIXI.Graphics();
  }

  private returnGraphicsToPool(graphics: PIXI.Graphics): void {
    graphics.clear();
    this.graphicsPool.push(graphics);
  }

  drawSnake(segments: Position[]): void {
    // 回收当前所有图形对象到对象池
    while (this.snakeContainer.children.length > 0) {
      const graphics = this.snakeContainer.removeChildAt(0) as PIXI.Graphics;
      this.returnGraphicsToPool(graphics);
    }

    segments.forEach(segment => {
      const snakeSegment = this.getGraphicsFromPool();
      snakeSegment.rect(
        segment.x * this.gridSize,
        segment.y * this.gridSize,
        this.gridSize - 1,
        this.gridSize - 1
      );
      snakeSegment.fill({ color: 0x00FF00 }); // Green color
      this.snakeContainer.addChild(snakeSegment);
    });
  }

  drawFood(position: Position): void {
    if (!this.foodSprite) {
      this.foodSprite = new PIXI.Graphics();
      this.app.stage.addChild(this.foodSprite);
    }

    this.foodSprite.clear();
    this.foodSprite.rect(
      position.x * this.gridSize,
      position.y * this.gridSize,
      this.gridSize - 1,
      this.gridSize - 1
    );
    this.foodSprite.fill({ color: 0xFF0000 }); // Red color
  }

  async setTexture(textureUrl: string): Promise<void> {
    try {
      await PIXI.Assets.load(textureUrl);
    } catch (error) {
      throw new Error('Failed to load texture');
    }
  }

  setLighting(ambient: number, diffuse: number): void {
    // Pixi.js 2D renderer doesn't support 3D lighting
  }

  destroy(): void {
    // 清理对象池
    this.graphicsPool.forEach(graphics => graphics.destroy());
    this.graphicsPool = [];
    
    // 清理其他资源
    if (this.foodSprite) {
      this.foodSprite.destroy();
      this.foodSprite = null;
    }
    this.snakeContainer.destroy();
    this.app.destroy(true);
  }
}