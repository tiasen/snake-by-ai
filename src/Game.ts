import { GAME_CONFIG } from './config/gameConfig';
import { ISnake, IFood, IGame } from './interfaces/game.interfaces';
import { Position, Direction } from './types/game.types';
import { IRender } from './interfaces/render.interfaces';
import { IInputHandler } from './interfaces/input.interfaces';
import { IGameUI } from './interfaces/ui.interfaces';

export class Game implements IGame {
  private snake: ISnake;
  private food: IFood;
  private renderer: IRender;
  private inputHandler: IInputHandler;
  private gameUI: IGameUI;
  private score: number;
  private gameLoop: number | null;

  constructor(
    snake: ISnake,
    food: IFood,
    renderer: IRender,
    inputHandler: IInputHandler,
    gameUI: IGameUI
  ) {
    this.snake = snake;
    this.food = food;
    this.renderer = renderer;
    this.inputHandler = inputHandler;
    this.gameUI = gameUI;
    this.score = 0;
    this.gameLoop = null;

    // 初始化游戏
    this.initializeGame();
  }

  private async initializeGame(): Promise<void> {
    try {
      // 等待渲染器初始化完成
      await this.renderer.initialize();
      
      // 初始化输入处理器和UI
      this.inputHandler.initialize();
      this.inputHandler.onGameToggle(() => this.toggleGame());
      this.inputHandler.onDirectionChange((direction) => this.handleDirectionChange(direction));
      this.gameUI.initializeControls(
        () => this.toggleGame(),
        (event) => this.inputHandler.handleKeyDown(event)
      );

      // 初始渲染
      this.render();
    } catch (error) {
      console.error('游戏初始化失败:', error);
    }
  }



  public toggleGame(): void {
    if (!this.gameLoop) {
      this.start();
      this.gameUI.updateStartButton(true);
    } else {
      this.pause();
      this.gameUI.updateStartButton(false);
    }
  }

  public start(): void {
    if (this.gameLoop) return;
    // 使用requestAnimationFrame来优化渲染性能
    let lastTime = 0;
    const gameSpeed = GAME_CONFIG.GAME_SPEED;
    
    const animate = (currentTime: number) => {
      if (!this.gameLoop) return;
      
      const deltaTime = currentTime - lastTime;
      if (deltaTime >= gameSpeed) {
        this.update();
        lastTime = currentTime;
      }
      
      this.gameLoop = requestAnimationFrame(animate);
    };
    
    this.gameLoop = requestAnimationFrame(animate);
  }

  public pause(): void {
    if (!this.gameLoop) return;
    cancelAnimationFrame(this.gameLoop);
    this.gameLoop = null;
  }

  private update(): void {
    const head = this.calculateNextHead();

    if (this.checkCollision(head)) {
      this.gameOver();
      return;
    }

    this.snake.move(head);

    if (this.checkFoodCollision(head)) {
      this.handleFoodCollection();
    } else {
      this.snake.shrink();
    }

    this.render();
  }

  private calculateNextHead(): Position {
    const head = { ...this.snake.getHead() };
    const direction = this.snake.getDirection();

    switch (direction) {
      case 'up': head.y--; break;
      case 'down': head.y++; break;
      case 'left': head.x--; break;
      case 'right': head.x++; break;
    }

    return head;
  }

  private checkCollision(head: Position): boolean {
    // 检查是否撞墙
    if (head.x < 0 || 
        head.x >= GAME_CONFIG.CANVAS.WIDTH / GAME_CONFIG.CANVAS.GRID_SIZE || 
        head.y < 0 || 
        head.y >= GAME_CONFIG.CANVAS.HEIGHT / GAME_CONFIG.CANVAS.GRID_SIZE) {
      return true;
    }
    // 检查是否撞到自己
    return this.snake.collidesWithSelf(head);
  }

  private checkFoodCollision(head: Position): boolean {
    const foodPosition = this.food.getPosition();
    return head.x === foodPosition.x && head.y === foodPosition.y;
  }

  private handleFoodCollection(): void {
    this.score += GAME_CONFIG.SCORE_INCREMENT;
    this.gameUI.updateScore(this.score);
    this.food.regenerate(this.snake);
  }

  private render(): void {
    this.renderer.clear();
    this.renderer.drawSnake(this.snake.getSegments());
    this.renderer.drawFood(this.food.getPosition());
  }

  private handleDirectionChange(newDirection: Direction): void {
    this.snake.setDirection(newDirection);
  }

  private gameOver(): void {
    this.pause();
    this.gameUI.showGameOver(this.score);
    this.reset();
  }

  public reset(): void {
    this.snake.reset();
    this.score = 0;
    this.gameUI.reset();
    this.food.regenerate(this.snake);
    this.render();
  }
}