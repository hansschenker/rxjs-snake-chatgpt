export const COLS = 30;
export const ROWS = 30;

export const GAP_SIZE = 1;
export const CELL_SIZE = 10;

export const APPLE_COUNT = 2;
export const POINTS_PER_APPLE = 1;
export const GROW_PER_APPLE = 1;

export const SNAKE_BODY_INITIAL = 3;
export const SPEED = 300;

export const DIRECTIONS = {
  LEFT: { x: -1, y: 0 },
  UP: { x: 0, y: -1 },
  RIGHT: { x: 1, y: 0 },
  DOWN: { x: 0, y: 1 },
} as const;

export const INITIAL_DIRECTION = DIRECTIONS.DOWN;

export const KEY_CODES = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
};
