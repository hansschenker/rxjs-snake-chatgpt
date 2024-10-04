import { BehaviorSubject, combineLatest, fromEvent, interval, takeWhile } from "rxjs"
import { distinctUntilChanged, filter, map, scan, share, skip, startWith, takeUntil, withLatestFrom } from 'rxjs';
import { generateApples, generateSnake, moveSnake, notOpposite, checkCollision , getRandomNumber, getRandomPosition, gameOver} from './functions';
import { DIRECTIONS, INITIAL_DIRECTION, KEY_CODES, SNAKE_BODY_INITIAL, SPEED, APPLE_COUNT, POINTS_PER_APPLE, GROW_PER_APPLE } from './constants';
import { Point, GameModel } from './types';

// Observable for game ticks
export const tick$ = interval(SPEED);

// Observable for keyboard input
export const keyDown$ = fromEvent<KeyboardEvent>(document.body, 'keydown').pipe(
  map((e) => {
    switch (e.keyCode) {
      case KEY_CODES.LEFT: return DIRECTIONS.LEFT;
      case KEY_CODES.UP: return DIRECTIONS.UP;
      case KEY_CODES.RIGHT: return DIRECTIONS.RIGHT;
      case KEY_CODES.DOWN: return DIRECTIONS.DOWN;
      default: return null;
    }
  }),
  filter((direction): direction is typeof DIRECTIONS[keyof typeof DIRECTIONS] => direction !== null),
  startWith(INITIAL_DIRECTION),
  scan(notOpposite),
  distinctUntilChanged()
);

// Observable to track snake growth
export const increaseBody$ = new BehaviorSubject<number>(0);
export const snakeBody$ = increaseBody$.pipe(
  scan((snakeBody, grow) => snakeBody + grow, SNAKE_BODY_INITIAL)
);

// Observable for snake state
export const snakeState$ = tick$.pipe(
  withLatestFrom(keyDown$, snakeBody$, (_, direction, snakeBody) => ({ direction, snakeBody })),
  scan((snake, { direction, snakeBody }) => moveSnake(snake, direction, snakeBody), generateSnake(SNAKE_BODY_INITIAL))
);

// Observable for apples
export const apples$ = snakeState$.pipe(
  scan((apples, snake) => {
    const head = snake[0];
    const withoutEaten = apples.filter(apple => !head || !checkCollision(head, apple));
    const wasEaten = withoutEaten.length < apples.length;
    const added = wasEaten ? [getRandomPosition(snake)] : [];
    return [...withoutEaten, ...added]
    }, generateApples(APPLE_COUNT)),    
    share()
);

export const score$ = increaseBody$
  .pipe(
    skip(1),
    startWith(0),
    scan((score, _) => score + POINTS_PER_APPLE)
  );

export const model$ = combineLatest(
  snakeState$, apples$, score$,
  (snake, apples, score) => ({ snake, apples, score })
);

// Define the initial state
const initialState: GameModel = {
  snake: [{ x: 0, y: 0 }], // Assuming Body is an array of Points
  score: 0, // Assuming Score is a number
  apples: [] // Assuming Apples is an array of Points
};

// Example game state observable
export const game$ = interval(1000).pipe(
  scan((model: GameModel) => {
    // Update game state logic here
    // For example, move the snake
    const newHead = { x: model.snake[0].x + 1, y: model.snake[0].y };
    return { ...model, snake: [newHead, ...model.snake.slice(0, -1)] };
  },initialState),
  gameOver()
);
