export class Game {
    public rows = 64;
    public cols = 64;

    public snake = this.createSnake();

    public createSnake() {
        const length = 8;
        const x = Math.floor(this.cols * 0.5) - Math.floor(length * 0.5);
        const y = Math.floor(this.rows * 0.5);

        const snake = new Snake();
        for (let i = 0; i < length; i++) {
            snake.push(new Cell(x - i, y));
        }

        return snake;
    }

    public advanceSnake(snake: Snake) {
        const head = snake.pop();
        if (head !== undefined) {
            head.x = snake[0].x;
            head.y = snake[0].y;

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

            if (head.x < 0) head.x = this.cols - 1;
            if (head.y < 0) head.y = this.rows - 1;

            if (head.x > this.cols - 1) head.x = 0;
            if (head.y > this.rows - 1) head.y = 0;

            snake.unshift(head);
        }
    }

    public update() {
        this.advanceSnake(this.snake);
    }
}

export class Snake extends Array<Cell> {
    public direction = Direction.right;
}

export class Cell {
    public x: number;
    public y: number;
    public constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}

export enum Direction {
    up,
    down,
    left,
    right
}
