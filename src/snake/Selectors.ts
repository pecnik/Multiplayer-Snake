import { State } from "./data/State";
import { Snake } from "./data/Snake";
import { SnakeFSM } from "./data/SnakeFSM";
import { range } from "lodash";

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

export const SPECIAL_CHARACTERS = ["-", "_", " "];
export const ALLOWED_CHARACTERS = [
    ...SPECIAL_CHARACTERS.map(x => x.charCodeAt(0)),
    ...range("a".charCodeAt(0), "z".charCodeAt(0)),
    ...range("A".charCodeAt(0), "Z".charCodeAt(0)),
    ...range("0".charCodeAt(0), "9".charCodeAt(0))
];

export function getPlayerNameErrors(name: string): string | undefined {
    if (name.length < 3) {
        return "Name must contain at least 3 characters.";
    }

    if (name.length > 12) {
        return "Name cannot be longer than 12 characters.";
    }

    for (let i = 0; i < name.length; i++) {
        const charCode = name.charCodeAt(i);
        if (ALLOWED_CHARACTERS.indexOf(charCode) === -1) {
            return "Names can only contain letters and numbers.";
        }
    }

    return;
}
