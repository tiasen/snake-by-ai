import { Direction } from '../types/game.types';
import { IKeyboardInput } from '../interfaces/input.interfaces';

export class KeyboardInput implements IKeyboardInput {
  private directionCallback: ((direction: Direction) => void) | null = null;
  private toggleCallback: (() => void) | null = null;
  private keyMappings: Record<string, Direction> = {
    'ArrowUp': 'up',
    'ArrowDown': 'down',
    'ArrowLeft': 'left',
    'ArrowRight': 'right',
    'w': 'up',
    's': 'down',
    'a': 'left',
    'd': 'right'
  };

  initialize(): void {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  destroy(): void {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }

  onDirectionChange(callback: (direction: Direction) => void): void {
    this.directionCallback = callback;
  }

  onGameToggle(callback: () => void): void {
    this.toggleCallback = callback;
  }

  setKeyMappings(mappings: Record<string, Direction>): void {
    this.keyMappings = { ...this.keyMappings, ...mappings };
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.code === 'Space' && this.toggleCallback) {
      this.toggleCallback();
      return;
    }

    const direction = this.keyMappings[event.key];
    if (direction && this.directionCallback) {
      this.directionCallback(direction);
    }
  }
}