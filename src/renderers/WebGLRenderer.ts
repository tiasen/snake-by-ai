import { GAME_CONFIG } from '../config/gameConfig';
import { Position } from '../types/game.types';
import { IWebGLRender } from '../interfaces/render.interfaces';

export class WebGLRenderer implements IWebGLRender {
  private canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext;
  private shaderProgram: WebGLProgram | null = null;
  private positionBuffer: WebGLBuffer | null = null;
  private colorBuffer: WebGLBuffer | null = null;
  private gridSize: number;

  constructor(canvasId: string) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
      throw new Error('Canvas element not found');
    }
    this.canvas = canvas;
    const gl = this.canvas.getContext('webgl');
    if (!gl) {
      throw new Error('WebGL not supported');
    }
    this.gl = gl;
    this.gridSize = GAME_CONFIG.CANVAS.GRID_SIZE;
  }

  initialize(): void {
    this.setDimensions(GAME_CONFIG.CANVAS.WIDTH, GAME_CONFIG.CANVAS.HEIGHT);
    this.initShaders();
    this.createBuffers();
  }

  getContext(): WebGLRenderingContext {
    return this.gl;
  }

  setGridSize(size: number): void {
    this.gridSize = size;
  }

  setDimensions(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
    this.gl.viewport(0, 0, width, height);
  }

  initShaders(): void {
    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, `#version 100
      attribute vec2 aPosition;
      attribute vec4 aColor;
      varying vec4 vColor;
      uniform vec2 uResolution;
      
      void main() {
        vec2 zeroToOne = aPosition / uResolution;
        vec2 zeroToTwo = zeroToOne * 2.0;
        vec2 clipSpace = zeroToTwo - 1.0;
        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
        vColor = aColor;
      }
    `);

    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, `#version 100
      precision mediump float;
      varying vec4 vColor;
      
      void main() {
        gl_FragColor = vColor;
      }
    `);

    this.shaderProgram = this.createProgram(vertexShader, fragmentShader);
    this.gl.useProgram(this.shaderProgram);
  }

  createBuffers(): void {
    this.positionBuffer = this.gl.createBuffer();
    this.colorBuffer = this.gl.createBuffer();
  }

  clear(): void {
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  drawSnake(segments: Position[]): void {
    if (!this.shaderProgram) return;

    const positions: number[] = [];
    const colors: number[] = [];
    const snakeColor = [0.0, 1.0, 0.0, 1.0]; // Green

    segments.forEach(segment => {
      const x = segment.x * this.gridSize;
      const y = segment.y * this.gridSize;
      
      // Create a square for each segment
      positions.push(
        x, y,
        x + this.gridSize - 1, y,
        x, y + this.gridSize - 1,
        x + this.gridSize - 1, y + this.gridSize - 1
      );

      // Add colors for each vertex
      for (let i = 0; i < 4; i++) {
        colors.push(...snakeColor);
      }
    });

    this.drawElements(positions, colors);
  }

  drawFood(position: Position): void {
    if (!this.shaderProgram) return;

    const x = position.x * this.gridSize;
    const y = position.y * this.gridSize;
    const positions = [
      x, y,
      x + this.gridSize - 1, y,
      x, y + this.gridSize - 1,
      x + this.gridSize - 1, y + this.gridSize - 1
    ];

    const foodColor = [1.0, 0.0, 0.0, 1.0]; // Red
    const colors: number[] = [];
    for (let i = 0; i < 4; i++) {
      colors.push(...foodColor);
    }

    this.drawElements(positions, colors);
  }

  setTexture(textureUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const texture = this.gl.createTexture();
      const image = new Image();
      
      image.onload = () => {
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
        resolve();
      };
      
      image.onerror = () => reject(new Error('Failed to load texture'));
      image.src = textureUrl;
    });
  }

  setLighting(ambient: number, diffuse: number): void {
    if (!this.shaderProgram) return;
    
    const ambientLoc = this.gl.getUniformLocation(this.shaderProgram, 'uAmbient');
    const diffuseLoc = this.gl.getUniformLocation(this.shaderProgram, 'uDiffuse');
    
    this.gl.uniform1f(ambientLoc, ambient);
    this.gl.uniform1f(diffuseLoc, diffuse);
  }

  destroy(): void {
    if (this.shaderProgram) {
      this.gl.deleteProgram(this.shaderProgram);
    }
    if (this.positionBuffer) {
      this.gl.deleteBuffer(this.positionBuffer);
    }
    if (this.colorBuffer) {
      this.gl.deleteBuffer(this.colorBuffer);
    }
  }

  private createShader(type: number, source: string): WebGLShader {
    const shader = this.gl.createShader(type);
    if (!shader) {
      throw new Error('Failed to create shader');
    }

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const info = this.gl.getShaderInfoLog(shader);
      this.gl.deleteShader(shader);
      throw new Error('Shader compilation error: ' + info);
    }

    return shader;
  }

  private createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
    const program = this.gl.createProgram();
    if (!program) {
      throw new Error('Failed to create shader program');
    }

    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      const info = this.gl.getProgramInfoLog(program);
      this.gl.deleteProgram(program);
      throw new Error('Shader program linking error: ' + info);
    }

    return program;
  }

  private drawElements(positions: number[], colors: number[]): void {
    if (!this.shaderProgram || !this.positionBuffer || !this.colorBuffer) return;

    // Set position attribute
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);
    const positionLoc = this.gl.getAttribLocation(this.shaderProgram, 'aPosition');
    this.gl.enableVertexAttribArray(positionLoc);
    this.gl.vertexAttribPointer(positionLoc, 2, this.gl.FLOAT, false, 0, 0);

    // Set color attribute
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);
    const colorLoc = this.gl.getAttribLocation(this.shaderProgram, 'aColor');
    this.gl.enableVertexAttribArray(colorLoc);
    this.gl.vertexAttribPointer(colorLoc, 4, this.gl.FLOAT, false, 0, 0);

    // Set resolution uniform
    const resolutionLoc = this.gl.getUniformLocation(this.shaderProgram, 'uResolution');
    this.gl.uniform2f(resolutionLoc, this.canvas.width, this.canvas.height);

    // Draw
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, positions.length / 2);
  }
}