import { MonoTypeOperatorFunction, Observable, pipe, Subscriber, tap } from "rxjs";
import { COLS, ROWS } from "./constants";
import { GameModel, Point } from "./types";

// Generates an array of numbers from 0 to l - 1
const range = (l: number): number[] => [...Array(l).keys()];

// Generates the initial snake body of given length
export function generateSnake(length: number): Point[] {
  return range(length).map((i) => ({ x: i, y: 0 }));
}

// Moves the snake in the specified direction, adjusting its body size
export function moveSnake(
  snake: Point[],
  direction: Point,
  snakeBody: number
): Point[] {
  const head = snake[0];
  const newHead: Point = {
    x: head.x + direction.x,
    y: head.y + direction.y,
  };

  const ateApple = snakeBody > snake.length;
  const newBody = ateApple ? snake : snake.slice(0, -1);

  return [newHead, ...newBody].map(wrapBounds);
}

// Determines if the direction change is valid (not the opposite direction)
export function notOpposite(previous: Point, next: Point): Point {
  const isOpposite = (previous: Point, next: Point) =>
    next.x === -previous.x || next.y === -previous.y;

  return isOpposite(previous, next) ? previous : next;
}

// Generates apples on the board at random positions
export function generateApples(count: number): Point[] {
  return range(count).map(() => getRandomPosition());
}

// Checks if a given cell is empty and not occupied by the snake
function isEmptyCell(position: Point, snake: Point[]): boolean {
  return !snake.some((segment) => checkCollision(segment, position));
}

// Gets a random position on the board that is not occupied by the snake
export function getRandomPosition(snake: Point[] = []): Point {
  const position: Point = {
    x: getRandomNumber(0, COLS - 1),
    y: getRandomNumber(0, ROWS - 1),
  };

  return isEmptyCell(position, snake) ? position : getRandomPosition(snake);
}

// Checks if two points occupy the same position
export function checkCollision(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y;
}

// Ensures the point is within the board boundaries
export function wrapBounds(point: Point): Point {
  const x = point.x >= COLS ? 0 : point.x < 0 ? COLS - 1 : point.x;
  const y = point.y >= ROWS ? 0 : point.y < 0 ? ROWS - 1 : point.y;

  return { x, y };
}

// Generates a random number between min and max, inclusive
export function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function gameOver(): MonoTypeOperatorFunction<GameModel> {
  return pipe(
    tap((model: GameModel) => {
      const isGameOver = model.snake.slice(1).some(segment => checkCollision(model.snake[0], segment));
      if (isGameOver) {
        throw new Error("Game Over");
      }
    })
  );
}
