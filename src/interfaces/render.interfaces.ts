import { Position } from '../types/game.types';

export interface IRender {
  clear(): void;
  drawSnake(segments: Position[]): void;
  drawFood(position: Position): void;
  initialize(): void;
  destroy(): void;
}

export interface ICanvasRender extends IRender {
  getContext(): CanvasRenderingContext2D;
  setGridSize(size: number): void;
  setDimensions(width: number, height: number): void;
}

export interface IWebGLRender extends IRender {
  getContext(): WebGLRenderingContext;
  setGridSize(size: number): void;
  setDimensions(width: number, height: number): void;
  initShaders(): void;
  createBuffers(): void;
  setTexture(textureUrl: string): Promise<void>;
  setLighting(ambient: number, diffuse: number): void;
}

export interface IPixiRender extends IRender {
  setGridSize(size: number): void;
  setDimensions(width: number, height: number): void;
  setTexture(textureUrl: string): Promise<void>;
}