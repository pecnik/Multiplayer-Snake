import { Game, Direction } from "./snake/Game";
import { Keys } from "./snake/Keys";

{
    "use strict";

    const game = new Game();

    const CELL = 8;
    const WIDTH = game.cols * CELL;
    const HEIGHT = game.rows * CELL;

    const KEY_BINDS: { [key: string]: Direction } = {
        [Keys.W]: Direction.up,
        [Keys.A]: Direction.left,
        [Keys.S]: Direction.down,
        [Keys.D]: Direction.right,

        [Keys.ARROW_UP]: Direction.up,
        [Keys.ARROW_LEFT]: Direction.left,
        [Keys.ARROW_DOWN]: Direction.down,
        [Keys.ARROW_RIGHT]: Direction.right
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
            game.snake.input = direction;
        }
    });

    setInterval(() => {
        game.update();
        requestAnimationFrame(render);
    }, 1000 / 10);

    function render() {
        const ctx = buffer.getContext("2d");
        if (ctx !== null) {
            ctx.clearRect(0, 0, WIDTH, HEIGHT);
            ctx.fillStyle = "#f2f2f2";
            game.snake.forEach(cell => {
                ctx.fillRect(cell.x * CELL, cell.y * CELL, CELL, CELL);
            });
        }

        const screen = cavnas.getContext("2d");
        if (screen !== null) {
            screen.clearRect(0, 0, WIDTH, HEIGHT);
            screen.drawImage(buffer, 0, 0);
        }
    }
}
