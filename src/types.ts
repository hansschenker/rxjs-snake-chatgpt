export type Score = number;

export interface Point {
  x: number;
  y: number;
}

export type Apple = Point;
export type Apples = Apple[];

export type Body = Point[];

export interface SnakeState {
  direction: Point;
  body: Body;
}

export type GameModel = {
  snake: Body;
  score: Score;
  apples: Apples;
};


export enum GameState {
  RUNNING,
  GAME_OVER,
}
