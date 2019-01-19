import { State } from "../game/data/State";
import { Keys } from "../game/data/Keys";
import { Direction } from "../game/data/Types";
import { update } from "../game/Update";
import { dispatch } from "../game/Dispatch";
import { Action } from "../game/Actions";

{
    "use strict";

    const game = new State();

    const CELL = 16;
    const PADD = 2;
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
            game.snakes.forEach(snake => {
                dispatch(game, new Action.SET_SNAKE_INPUT(snake.id, direction));
            });
        }
    });

    setInterval(() => {
        update(game);
        requestAnimationFrame(render);
    }, 1000 / 5);

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
