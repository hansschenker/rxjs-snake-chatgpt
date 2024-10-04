

import { Observable, MonoTypeOperatorFunction } from 'rxjs';
import { operate } from 'rxjs/internal/util/lift';
import { createOperatorSubscriber } from 'rxjs/internal/operators/OperatorSubscriber';
import { GameModel, Point } from './types';

function checkCollision(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y;
}

export function gameOver(): MonoTypeOperatorFunction<GameModel> {
  return operate((source, subscriber) => {
    source.subscribe(
      createOperatorSubscriber(subscriber, (model: GameModel) => {
        const isGameOver = model.snake.slice(1).some(segment => checkCollision(model.snake[0], segment));
        if (!isGameOver) {
          subscriber.next(model);
        } else {
          subscriber.complete();
        }
      })
    );
  });
}
