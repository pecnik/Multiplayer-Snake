export class Game {
    public readonly rows = 32;
    public readonly cols = 32;

    public snake = this.newSnake();
    public food = new Array<Cell>();

    public newSnake() {
        const length = 3;
        const x = Math.floor(this.cols * 0.5) - Math.floor(length * 0.5);
        const y = Math.floor(this.rows * 0.5);

        const snake = new Snake();
        snake.direction = Direction.right;
        for (let i = 0; i < length; i++) {
            snake.push(this.newSnakeCell(x - i, y));
        }

        return snake;
    }

    public newFoodCell(x: number, y: number) {
        return new Cell(CellType.Food, x, y);
    }

    public newSnakeCell(x: number, y: number) {
        return new Cell(CellType.Snake, x, y);
    }

    public isCellEmpty(x: number, y: number): boolean {
        for (let i = 0; i < this.snake.length; i++) {
            const cell = this.snake[i];
            if (cell.x === x && cell.y === y) return false;
        }

        for (let i = 0; i < this.food.length; i++) {
            const food = this.food[i];
            if (food.x === x && food.y === y) return false;
        }

        return true;
    }

    public hasValidInput(snake: Snake): boolean {
        switch (snake.input) {
            case Direction.up:
                return this.snake.direction !== Direction.down;
            case Direction.down:
                return this.snake.direction !== Direction.up;
            case Direction.left:
                return this.snake.direction !== Direction.right;
            case Direction.right:
                return this.snake.direction !== Direction.left;
            default:
                return false;
        }
    }

    public getNextSnakeHead() {
        const head = this.newSnakeCell(this.snake[0].x, this.snake[0].y);
        switch (this.snake.direction) {
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
        if (head.x < 0) head.x = this.cols - 1;
        if (head.y < 0) head.y = this.rows - 1;
        if (head.x > this.cols - 1) head.x = 0;
        if (head.y > this.rows - 1) head.y = 0;

        return head;
    }

    public update() {
        // Apply direction input
        if (this.hasValidInput(this.snake)) {
            this.snake.direction = this.snake.input;
        }

        // Get next snake-head
        const head = this.getNextSnakeHead();

        // Check snake collision
        const ateBody = this.snake.find(cell => {
            return cell.x === head.x && cell.y === head.y;
        });

        // Check food collision
        const ateFood = this.food.find((food, index) => {
            const collision = food.x === head.x && food.y === head.y;
            if (collision) {
                this.food.splice(index, 1);
            }
            return collision;
        });

        if (ateBody) {
            this.snake = this.newSnake();
            this.food = [];
        } else if (ateFood) {
            this.snake.unshift(head);
        } else {
            this.snake.unshift(head);
            this.snake.pop();
        }

        // Spawn new food
        if (this.food.length < 3) {
            const x = Math.floor(Math.random() * this.cols);
            const y = Math.floor(Math.random() * this.rows);
            if (this.isCellEmpty(x, y)) {
                this.food.push(this.newFoodCell(x, y));
            }
        }
    }
}

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

export class Snake extends Array<Cell> {
    public direction = Direction.right;
    public input = Direction.right;
}
