import { Game } from "./snake/Game";

{
    "use strict";

    const game = new Game();

    const cellSize = 8;
    const width = game.cols * cellSize;
    const height = game.rows * cellSize;

    const app = document.getElementById("app");
    if (app === null) {
        throw new Error("Missing #app element");
    }

    const cavnas = document.createElement("canvas");
    const buffer = document.createElement("canvas");
    cavnas.width = buffer.width = width;
    cavnas.height = buffer.height = height;
    app.appendChild(cavnas);

    setInterval(() => {
        game.update();
        requestAnimationFrame(render);
    }, 1000 / 10);

    function render() {
        const ctx = buffer.getContext("2d");
        if (ctx === null) return;

        ctx.clearRect(0, 0, width, height);

        ctx.fillStyle = "#f2f2f2";
        game.snake.cells.forEach(cell => {
            ctx.fillRect(
                cell.x * cellSize,
                cell.y * cellSize,
                cellSize,
                cellSize
            );
        });

        const screen = cavnas.getContext("2d");
        if (screen !== null) {
            screen.clearRect(0, 0, width, height);
            screen.drawImage(buffer, 0, 0);
        }
    }
}
