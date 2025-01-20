import './style.css';
import { Game } from './Game';
import { Snake } from './entities/Snake';
import { Food } from './entities/Food';
import { PixiRenderer } from './renderers/PixiRenderer';
import { GameUI } from './entities/GameUI';
import { KeyboardInput } from './entities/KeyboardInput';

// 初始化游戏组件
const renderer = new PixiRenderer('gameCanvas');
const snake = new Snake();
const food = new Food();
const gameUI = new GameUI();
const keyboardInput = new KeyboardInput();

// 创建游戏实例
const game = new Game(snake, food, renderer, keyboardInput, gameUI);
