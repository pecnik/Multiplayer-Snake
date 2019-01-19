import SocketIOClient from "socket.io-client";
import { State } from "./data/State";
import { Direction } from "./data/Direction";
import { Keys } from "./data/Keys";
import { Action } from "./Actions";
import { dispatch } from "./Dispatch";

export function GameClient($el: HTMLElement) {
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

    const cavnas = document.createElement("canvas");
    const buffer = document.createElement("canvas");
    cavnas.width = buffer.width = WIDTH;
    cavnas.height = buffer.height = HEIGHT;
    $el.appendChild(cavnas);

    const socket = SocketIOClient.connect(
        location.href.replace(location.port, "8080"),
        { reconnection: false }
    );

    socket.on("sync-state", (serverState: State) => {
        Object.assign(game, serverState);
        requestAnimationFrame(render);
    });

    socket.on("tick", (udpates: Action[]) => {
        udpates.forEach(action => dispatch(game, action));
        requestAnimationFrame(render);
    });

    document.addEventListener("keydown", ev => {
        const direction = KEY_BINDS[ev.keyCode];
        if (socket.id !== undefined && direction !== undefined) {
            socket.emit("input", direction);
        }
    });

    function render() {
        if (game.freezeScreen.timer > 0) {
            const screen = cavnas.getContext("2d");
            if (screen !== null) {
                screen.clearRect(0, 0, WIDTH, HEIGHT);
                if (game.freezeScreen.timer % 2 === 0) {
                    screen.drawImage(buffer, 0, 0);
                }
            }
            return;
        }

        const ctx = buffer.getContext("2d");
        if (ctx !== null) {
            ctx.clearRect(0, 0, WIDTH, HEIGHT);

            ctx.fillStyle = "#7efff5";
            game.food.forEach(cell => {
                ctx.fillRect(
                    cell.x * CELL,
                    cell.y * CELL,
                    CELL - PADD,
                    CELL - PADD
                );
            });

            game.snakes.forEach(snake => {
                ctx.fillStyle = snake.id === socket.id ? "#18dcff" : "#f0932b";
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
