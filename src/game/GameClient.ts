import SocketIOClient from "socket.io-client";
import { State } from "./data/State";
import { Direction } from "./data/Direction";
import { Keys } from "./data/Keys";
import { Action } from "./Actions";
import { dispatch } from "./Dispatch";
import { Cell } from "./data/Cell";

export function GameClient($el: HTMLElement) {
    const game = new State();

    const CELL = 12;
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

    const name = prompt("Player name:", "Player");
    socket.emit("join", name);

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
        const LIGHT = "#60a3bc";
        const DARK = "#0a3d62";

        if (ctx !== null) {
            ctx.clearRect(0, 0, WIDTH, HEIGHT);

            // Draw world
            ctx.strokeStyle = LIGHT;
            ctx.strokeRect(1, 1, WORLD_WIDTH - 1, WORLD_HEIGHT - 1);
            ctx.fillStyle = LIGHT;
            game.food.forEach(cell => fillCell(ctx, cell));
            game.snakes.forEach(snake => {
                ctx.fillStyle = snake.id === socket.id ? DARK : LIGHT;
                snake.cells.forEach(cell => fillCell(ctx, cell));
            });

            // Draw side board
            ctx.translate(WORLD_WIDTH, 0);
            ctx.font = "20px VT323";
            ctx.textBaseline = "top";
            game.players.forEach((player, index) => {
                const x = 8;
                const y = 8 + 16 * index;
                const snake = game.snakes.find(snake => snake.id === player.id);
                const score = snake === undefined ? "X" : snake.cells.length;
                const text = `${index + 1}. ${player.name}: ${score}`;
                ctx.fillStyle = player.id === socket.id ? DARK : LIGHT;
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

    function fillCell(ctx: CanvasRenderingContext2D, cell: Cell) {
        ctx.fillRect(cell.x * CELL + 2, cell.y * CELL + 2, CELL - 1, CELL - 1);
    }
}
