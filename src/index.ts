import { Keys } from "./snake/Keys";
import { Snake } from "./snake/Snake";

{
    "use strict";

    const game = new Snake.GameState();

    const CELL = 16;
    const PADD = 2;
    const WIDTH = game.cols * CELL;
    const HEIGHT = game.rows * CELL;

    const KEY_BINDS: { [key: string]: Snake.Direction } = {
        [Keys.W]: Snake.Direction.up,
        [Keys.A]: Snake.Direction.left,
        [Keys.S]: Snake.Direction.down,
        [Keys.D]: Snake.Direction.right,
        [Keys.ARROW_UP]: Snake.Direction.up,
        [Keys.ARROW_LEFT]: Snake.Direction.left,
        [Keys.ARROW_DOWN]: Snake.Direction.down,
        [Keys.ARROW_RIGHT]: Snake.Direction.right
    };

    const app = document.getElementById("app");
    if (app === null) {
        throw new Error("Missing #app element");
    }

    const cavnas = document.createElement("canvas");
    const buffer = document.createElement("canvas");
    cavnas.width = buffer.width = WIDTH;
    cavnas.height = buffer.height = HEIGHT;
    app.appendChild(cavnas);

    document.addEventListener("keydown", ev => {
        const direction = KEY_BINDS[ev.keyCode];
        if (direction !== undefined) {
            game.snakes.forEach(snake => {
                snake.input = direction;
            });
        }
    });

    setInterval(() => {
        const cahnge = Snake.getStateChanges(game);
        Snake.applyStateChanges(game, cahnge);
        requestAnimationFrame(render);
    }, 1000 / 15);

    function render() {
        const ctx = buffer.getContext("2d");
        if (ctx !== null) {
            ctx.clearRect(0, 0, WIDTH, HEIGHT);

            ctx.fillStyle = "#999";

            game.food.forEach(cell => {
                ctx.fillRect(
                    cell.x * CELL,
                    cell.y * CELL,
                    CELL - PADD,
                    CELL - PADD
                );
            });

            game.snakes.forEach(snake => {
                snake.cells.forEach(cell => {
                    ctx.fillRect(
                        cell.x * CELL,
                        cell.y * CELL,
                        CELL - PADD,
                        CELL - PADD
                    );
                });
            });
        }

        const screen = cavnas.getContext("2d");
        if (screen !== null) {
            screen.clearRect(0, 0, WIDTH, HEIGHT);
            screen.drawImage(buffer, 0, 0);
        }
    }
}
