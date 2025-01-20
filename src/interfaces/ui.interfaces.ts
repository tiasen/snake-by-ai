import { Direction } from '../types/game.types';

export interface IGameUI {
  updateScore(score: number): void;
  updateStartButton(isPlaying: boolean): void;
  showGameOver(score: number): void;
  initializeControls(onStart: () => void, onKeyPress: (event: KeyboardEvent) => void): void;
  reset(): void;
}