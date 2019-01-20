import SocketIOClient from "socket.io-client";
import { State } from "./data/State";
import { Direction } from "./data/Direction";
import { Keys } from "./data/Keys";
import { Action } from "./Actions";
import { dispatch } from "./Dispatch";
import { Cell } from "./data/Cell";
import { CellType } from "./data/CellType";
import { SnakeFSM } from "./data/SnakeFSM";

export function GameClient($el: HTMLElement, name = prompt("No-name")) {
    const game = new State();
    let tick = 0;

    const CELL = 12;
    const CELL_SMALL = Math.floor(CELL / 3);
    const SIDE = 200;
    const WORLD_WIDTH = game.cols * CELL;
    const WORLD_HEIGHT = game.rows * CELL;
    const WIDTH = WORLD_WIDTH + SIDE;
    const HEIGHT = WORLD_HEIGHT;

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

    socket.emit("join", name);

    socket.on("sync-state", (serverState: State) => {
        Object.assign(game, serverState);
        requestAnimationFrame(render);
    });

    socket.on("tick", (udpates: Action[]) => {
        tick++;
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
        const ctx = buffer.getContext("2d");
        const LIGHT = "#60a3bc";
        const DARK = "#0a3d62";

        if (ctx !== null) {
            ctx.clearRect(0, 0, WIDTH, HEIGHT);

            // Draw world
            ctx.strokeStyle = LIGHT;
            ctx.strokeRect(1, 1, WORLD_WIDTH - 1, WORLD_HEIGHT - 1);
            ctx.fillStyle = LIGHT;
            game.food.forEach(cell => renderCell(ctx, cell));
            game.snakes.forEach(snake => {
                if (snake.fsm === SnakeFSM.Dead) return;
                if (snake.fsm === SnakeFSM.Spawning && tick % 2 === 0) return;
                if (snake.fsm === SnakeFSM.Despawning && tick % 2 === 0) return;

                ctx.fillStyle = snake.id === socket.id ? DARK : LIGHT;
                snake.cells.forEach(cell => renderCell(ctx, cell));
            });

            // Draw side board
            ctx.translate(WORLD_WIDTH, 0);
            ctx.font = "20px VT323";
            ctx.textBaseline = "top";

            // High score
            const x = Math.round(SIDE * 0.5);
            ctx.textAlign = "center";
            ctx.fillStyle = DARK;
            ctx.fillText(`*** HIGH SCORE ***`, x, 8);
            if (game.highScore > 0) {
                const score = game.highScore;
                const name = game.highScorePlayer;
                ctx.fillText(`${name}: ${score}`, x, 32);
            } else {
                ctx.fillText(`/`, x, 32);
            }

            ctx.fillText(`-----------------------`, x, 56);

            // Player scoreboard
            ctx.textAlign = "left";
            game.snakes.forEach((snake, index) => {
                const x = 16;
                const y = 80 + 16 * index;
                const score = snake === undefined ? "X" : snake.score;
                const text = `${index + 1}. ${snake.name}: ${score}`;
                ctx.fillStyle = snake.id === socket.id ? DARK : LIGHT;
                ctx.fillText(text, x, y);
            });
            ctx.translate(-WORLD_WIDTH, 0);
        }

        const screen = cavnas.getContext("2d");
        if (screen !== null) {
            screen.clearRect(0, 0, WIDTH, HEIGHT);
            screen.drawImage(buffer, 0, 0);
        }
    }

    function renderCell(ctx: CanvasRenderingContext2D, cell: Cell) {
        switch (cell.type) {
            case CellType.Food:
                for (let x = 0; x < 3; x++) {
                    for (let y = 0; y < 3; y++) {
                        if ((x === 1 && y !== 1) || (x !== 1 && y === 1)) {
                            ctx.fillRect(
                                cell.x * CELL + 1 + CELL_SMALL * x,
                                cell.y * CELL + 1 + CELL_SMALL * y,
                                CELL_SMALL,
                                CELL_SMALL
                            );
                        }
                    }
                }
                break;
            default:
                ctx.fillRect(
                    cell.x * CELL + 2,
                    cell.y * CELL + 2,
                    CELL - 1,
                    CELL - 1
                );
                break;
        }
    }
}
