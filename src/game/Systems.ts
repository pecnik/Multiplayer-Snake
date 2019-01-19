import { Action } from "./Actions";
import { State } from "./data/State";
import { Direction, Cell } from "./data/Types";
import { Snake } from "./data/Snake";
import { CellType } from "../snake/Game";

export interface System {
    (state: State, dispatcher: Action[]): void;
}

export function snakeInputSystem(state: State, dispatcher: Action[]) {
    state.snakes.forEach(snake => {
        const { input, dir } = snake;
        if (input === Direction.up && dir === Direction.down) return;
        if (input === Direction.down && dir === Direction.up) return;
        if (input === Direction.left && dir === Direction.right) return;
        if (input === Direction.right && dir === Direction.left) return;
        dispatcher.push(new Action.SET_SNAKE_DIR(snake.id, snake.input));
    });
}

export function snakeAdvanceSystem(state: State, dispatcher: Action[]) {
    state.snakes.forEach(snake => {
        const dy =
            (snake.dir === Direction.up ? -1 : 0) +
            (snake.dir === Direction.down ? 1 : 0);

        const dx =
            (snake.dir === Direction.left ? -1 : 0) +
            (snake.dir === Direction.right ? 1 : 0);

        const head = new Cell(
            CellType.Snake,
            snake.cells[0].x + dx,
            snake.cells[0].y + dy
        );

        // Loop through map
        if (head.x < 0) head.x = state.cols - 1;
        if (head.y < 0) head.y = state.rows - 1;
        if (head.x > state.cols - 1) head.x = 0;
        if (head.y > state.rows - 1) head.y = 0;

        dispatcher.push(new Action.ADVANCE_SNAKE_HEAD(snake.id, head));
    });
}

export function sankeFoodSystem(state: State, dispatcher: Action[]) {
    state.snakes.forEach(snake => {
        const [head] = snake.cells;
        const food = state.food.find(food => {
            return food.x === head.x && food.y === head.y;
        });

        if (food !== undefined) {
            dispatcher.push(new Action.REMOVE_FOOD(food));
        } else {
            dispatcher.push(new Action.REMOVE_SNAKE_TAIL(snake.id));
        }
    });
}

export function snakeSpawnSystem(state: State, dispatcher: Action[]) {
    if (state.snakes.length < 1) {
        const length = 3;
        const x = Math.floor(state.cols * 0.5) - Math.floor(length * 0.5);
        const y = Math.floor(state.rows * 0.5);

        const snake = new Snake("snake");
        snake.dir = Direction.right;
        for (let i = 0; i < length; i++) {
            snake.cells.push(new Cell(CellType.Snake, x - i, y));
        }

        dispatcher.push(new Action.ADD_SNAKE(snake));
    }
}

export function foodSpawnSystem(state: State, dispatcher: Action[]) {
    if (state.food.length < 3) {
        const x = Math.floor(Math.random() * state.cols);
        const y = Math.floor(Math.random() * state.rows);
        if (isCellRadiusEmpty(x, y, 5)) {
            const food = new Cell(CellType.Food, x, y);
            dispatcher.push(new Action.ADD_FOOD(food));
        }
    }

    function isCellEmpty(x: number, y: number): boolean {
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

    function isCellRadiusEmpty(x: number, y: number, radius: number): boolean {
        const x1 = x - radius;
        const x2 = x + radius;
        const y1 = y - radius;
        const y2 = y + radius;

        for (let x = x1; x <= x2; x++) {
            for (let y = y1; y <= y2; y++) {
                if (!isCellEmpty(x, y)) {
                    return false;
                }
            }
        }
        return true;
    }
}

export function snakeDeathSystem(state: State, dispatcher: Action[]) {
    state.snakes.forEach(snake => {
        const [head] = snake.cells;
        const collision = state.snakes.some(snake => {
            return snake.cells.some(cell => {
                if (head === cell) return false;
                if (head.x !== cell.x) return false;
                if (head.y !== cell.y) return false;
                return true;
            });
        });

        if (collision) {
            dispatcher.push(new Action.REMOVE_SNAKE(snake.id));
        }
    });
}