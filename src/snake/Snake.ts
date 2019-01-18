export module Snake {
    export enum Direction {
        up,
        down,
        left,
        right
    }

    export enum CellType {
        Snake,
        Food
    }

    export class Cell {
        public type: CellType;
        public x: number;
        public y: number;
        public constructor(type = CellType.Food, x = 0, y = 0) {
            this.type = type;
            this.x = x;
            this.y = y;
        }
    }

    export class Snake {
        public readonly id: string;
        public readonly cells = new Array<Cell>();
        public direction = Direction.right;
        public input = Direction.right;

        public constructor(id: string) {
            this.id = id;
        }
    }

    export interface SnakeChanges {
        id: string;
        head: Cell;
        removeTail: boolean;
    }

    export class GameState {
        readonly rows = 32;
        readonly cols = 32;
        public snakes = new Array<Snake>();
        public food = new Array<Cell>();
    }

    export interface StateChanges {
        addSnake?: Snake[];
        moveSnake?: { id: string; head: Cell }[];
        growSnake?: { id: string; head: Cell }[];
        removeSnake?: string[];
        addFood?: Cell[];
        removeFood?: Cell[];
    }

    export function getStateChanges(state: GameState): StateChanges {
        const changes: StateChanges = {};

        // Add snake
        if (state.snakes.length < 1) {
            changes.addSnake = changes.addSnake || [];
            changes.addSnake.push(newSnake(state, "snake-1"));
        }

        // Update snakes
        state.snakes.forEach(snake => {
            // Apply direction input
            if (isValidInput(snake)) {
                snake.direction = snake.input;
            }

            // Get next snake-head
            const head = getNextSnakeHead(state, snake);

            // Check snake collision
            const ateBody = snake.cells.find(cell => {
                return cell.x === head.x && cell.y === head.y;
            });

            // Check food collision
            const ateFood = state.food.some(food => {
                if (food.x === head.x && food.y === head.y) {
                    changes.removeFood = changes.removeFood || [];
                    changes.removeFood.push(food);
                    return true;
                } else {
                    return false;
                }
            });

            // Resolve
            if (ateBody) {
                changes.removeSnake = changes.removeSnake || [];
                changes.removeSnake.push(snake.id);
            } else if (ateFood) {
                changes.growSnake = changes.growSnake || [];
                changes.growSnake.push({ id: snake.id, head });
            } else {
                changes.moveSnake = changes.moveSnake || [];
                changes.moveSnake.push({ id: snake.id, head });
            }
        });

        // Spawn new food
        if (state.food.length < 3) {
            const x = Math.floor(Math.random() * state.cols);
            const y = Math.floor(Math.random() * state.rows);

            if (isCellRadiusEmpty(state, x, y, 5)) {
                changes.addFood = changes.addFood || [];
                changes.addFood.push(newFoodCell(x, y));
            }
        }

        return changes;
    }

    export function applyStateChanges(state: GameState, changes: StateChanges) {
        if (changes.addFood !== undefined) {
            changes.addFood.forEach(food => {
                state.food.push(food);
            });
        }

        if (changes.removeFood !== undefined) {
            changes.removeFood.forEach(remove => {
                state.food.some((food, index) => {
                    if (food.x === remove.x && food.y === remove.y) {
                        state.food.splice(index, 1);
                        return true;
                    } else {
                        return false;
                    }
                });
            });
        }

        if (changes.addSnake !== undefined) {
            changes.addSnake.forEach(snake => {
                state.snakes.push(snake);
            });
        }

        if (changes.moveSnake !== undefined) {
            changes.moveSnake.forEach(change => {
                const snake = state.snakes.find(snake => {
                    return snake.id === change.id;
                });

                if (snake !== undefined) {
                    snake.cells.unshift(change.head);
                    snake.cells.pop();
                }
            });
        }

        if (changes.growSnake !== undefined) {
            changes.growSnake.forEach(change => {
                const snake = state.snakes.find(snake => {
                    return snake.id === change.id;
                });

                if (snake !== undefined) {
                    snake.cells.unshift(change.head);
                }
            });
        }

        if (changes.removeSnake !== undefined) {
            changes.removeSnake.forEach(remove => {
                state.snakes.some((snake, index) => {
                    if (snake.id === remove) {
                        state.snakes.splice(index, 1);
                        return true;
                    } else {
                        return false;
                    }
                });
            });
        }
    }

    // Private functions
    // =====================================================

    function isValidInput(snake: Snake): boolean {
        switch (snake.input) {
            case Direction.up:
                return snake.direction !== Direction.down;
            case Direction.down:
                return snake.direction !== Direction.up;
            case Direction.left:
                return snake.direction !== Direction.right;
            case Direction.right:
                return snake.direction !== Direction.left;
            default:
                return false;
        }
    }

    function isCellEmpty(state: GameState, x: number, y: number): boolean {
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

    function isCellRadiusEmpty(
        state: GameState,
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

    function getNextSnakeHead(state: GameState, snake: Snake) {
        const head = newSnakeCell(snake.cells[0].x, snake.cells[0].y);
        switch (snake.direction) {
            case Direction.up:
                head.y--;
                break;
            case Direction.down:
                head.y++;
                break;
            case Direction.left:
                head.x--;
                break;
            case Direction.right:
                head.x++;
                break;
        }

        // Loop through map
        if (head.x < 0) head.x = state.cols - 1;
        if (head.y < 0) head.y = state.rows - 1;
        if (head.x > state.cols - 1) head.x = 0;
        if (head.y > state.rows - 1) head.y = 0;

        return head;
    }

    function newSnake(state: GameState, id: string) {
        const length = 3;
        const x = Math.floor(state.cols * 0.5) - Math.floor(length * 0.5);
        const y = Math.floor(state.rows * 0.5);

        const snake = new Snake(id);
        snake.direction = Direction.right;
        for (let i = 0; i < length; i++) {
            snake.cells.push(newSnakeCell(x - i, y));
        }

        return snake;
    }

    function newFoodCell(x: number, y: number) {
        return { type: CellType.Food, x, y };
    }

    function newSnakeCell(x: number, y: number) {
        return { type: CellType.Snake, x, y };
    }
}
