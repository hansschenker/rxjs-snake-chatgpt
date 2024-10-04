import { game$ } from './observables';
import { createCanvasElement, render } from './canvas'; // Assuming the canvas rendering functions are defined in this module
import { GameModel } from './types';

// Create the canvas and set it up
const canvas = createCanvasElement();
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

// Render the game state
if (ctx) {
  game$.subscribe({
    next: (value: unknown) => render(ctx, value as GameModel),
    complete: () => {
      console.log('Game Over!');
    }
  });
} else {
  console.error('Failed to get 2D context');
}