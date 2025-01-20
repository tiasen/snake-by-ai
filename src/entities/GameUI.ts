import { IGameUI } from '../interfaces/ui.interfaces';

export class GameUI implements IGameUI {
  private startButton: HTMLElement | null;
  private scoreElement: HTMLElement | null;

  constructor() {
    this.startButton = document.getElementById('startButton');
    this.scoreElement = document.getElementById('scoreValue');

    if (!this.startButton || !this.scoreElement) {
      throw new Error('Required UI elements not found');
    }
  }

  updateScore(score: number): void {
    if (this.scoreElement) {
      this.scoreElement.textContent = score.toString();
    }
  }

  updateStartButton(isPlaying: boolean): void {
    if (this.startButton) {
      this.startButton.textContent = isPlaying ? '暂停游戏' : '开始游戏';
      if (isPlaying) {
        this.startButton.classList.remove('paused');
      } else {
        this.startButton.classList.add('paused');
      }
    }
  }

  showGameOver(score: number): void {
    alert(`游戏结束！得分：${score}`);
  }

  initializeControls(onStart: () => void, onKeyPress: (event: KeyboardEvent) => void): void {
    if (this.startButton) {
      this.startButton.classList.add('paused');
      this.startButton.addEventListener('click', onStart);
    }
    document.addEventListener('keydown', onKeyPress);
  }

  reset(): void {
    this.updateScore(0);
    if (this.startButton) {
      this.startButton.style.display = 'block';
      this.updateStartButton(false);
    }
  }
}