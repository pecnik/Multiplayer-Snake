import { State } from "./data/State";
import { Snake } from "./data/Snake";
import { SnakeFSM } from "./data/SnakeFSM";

export const forEachDeadSnake = forEachSnakeFSM(SnakeFSM.Dead);
export const forEachAliveSnake = forEachSnakeFSM(SnakeFSM.Alive);
export const forEachSpawningSnake = forEachSnakeFSM(SnakeFSM.Spawning);
export const forEachDespawningSnake = forEachSnakeFSM(SnakeFSM.Despawning);
export function forEachSnakeFSM(fsm: SnakeFSM) {
    return (state: State, f: (snake: Snake) => void) => {
        state.snakes.forEach(snake => {
            if (snake.fsm === fsm) {
                f(snake);
            }
        });
    };
}

export function getSnakeScore(snake: Snake) {
    if (snake.fsm !== SnakeFSM.Alive) return 0;
    return snake.cells.length - 3;
}

export function isCellEmpty(state: State, x: number, y: number): boolean {
    for (let i = 0; i < state.snakes.length; i++) {
        const snake = state.snakes[i];
        for (let j = 0; j < snake.cells.length; j++) {
            const cell = snake.cells[j];
            if (cell.x === x && cell.y === y) return false;
        }
    }

    for (let i = 0; i < state.food.length; i++) {
        const food = state.food[i];
        if (food.x === x && food.y === y) return false;
    }

    return true;
}

export function isCellRadiusEmpty(
    state: State,
    x: number,
    y: number,
    radius: number
): boolean {
    const x1 = x - radius;
    const x2 = x + radius;
    const y1 = y - radius;
    const y2 = y + radius;

    for (let x = x1; x <= x2; x++) {
        for (let y = y1; y <= y2; y++) {
            if (!isCellEmpty(state, x, y)) {
                return false;
            }
        }
    }
    return true;
}
