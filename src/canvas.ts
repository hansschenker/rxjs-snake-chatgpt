import { COLS, ROWS, CELL_SIZE, GAP_SIZE } from "./constants";
import { Point, Body, Score, Apples, GameModel } from "./types";

export const CANVAS_WIDTH = COLS * (CELL_SIZE + GAP_SIZE);
export const CANVAS_HEIGHT = ROWS * (CELL_SIZE + GAP_SIZE);

export function createCanvasElement() {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  return canvas;
}

export function render(
  ctx: CanvasRenderingContext2D,
  { snake, score, apples }: GameModel
) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  renderBackground(ctx, score);
  renderSnake(ctx, snake);
  renderApples(ctx, apples);
}

export function renderBackground(ctx: CanvasRenderingContext2D, score: Score) {
  ctx.fillStyle = "rgba( 251, 251, 251, .7 )";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  if (!score) return;
  ctx.font = "24px serif";
  ctx.fillStyle = "green";
  ctx.fillText(`${score}`, 24, 24);
}

export function renderSnake(ctx: CanvasRenderingContext2D, snake: Body) {
  snake.forEach((segment: Point, i: number) =>
    paintCell(ctx, segment, getSegmentColor(i))
  );
}

export function renderApples(ctx: CanvasRenderingContext2D, apples: Apples) {
  apples.forEach((point) => {
    paintCell(ctx, point, "red");
  });
}

export function paintCell(
  ctx: CanvasRenderingContext2D,
  point: Point,
  color: string
) {
  const x = point.x * (CELL_SIZE + GAP_SIZE);
  const y = point.y * (CELL_SIZE + GAP_SIZE);

  ctx.fillStyle = color;
  ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
}

export function getSegmentColor(index: number) {
  const color = `#366bf3`; // blue
  return index === 0 ? "black" : color;
}
