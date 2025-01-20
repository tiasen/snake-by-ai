import { Direction } from '../types/game.types';

export interface IInputHandler {
  initialize(): void;
  destroy(): void;
  onDirectionChange(callback: (direction: Direction) => void): void;
  onGameToggle(callback: () => void): void;
  handleKeyDown(event: KeyboardEvent): void;
}

export interface IKeyboardInput extends IInputHandler {
  setKeyMappings(mappings: Record<string, Direction>): void;
}

export interface IGamepadInput extends IInputHandler {
  setButtonMappings(mappings: Record<number, Direction>): void;
  startPolling(): void;
  stopPolling(): void;
}