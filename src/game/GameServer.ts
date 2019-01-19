import SocketIO from "socket.io";
import { Action } from "./Actions";
import { State } from "./data/State";
import { dispatch } from "./Dispatch";
import {
    System,
    snakeInputSystem,
    snakeAdvanceSystem,
    sankeFoodSystem,
    foodSpawnSystem,
    snakeDeathSystem
} from "./Systems";
import { Cell } from "./data/Cell";
import { CellType } from "./data/CellType";
import { Direction } from "./data/Direction";
import { Snake } from "./data/Snake";

export function GameServer(io: SocketIO.Server) {
    const state = new State();
    const udpates = new Array<Action>();
    const systems = new Array<System>(
        snakeInputSystem,
        snakeAdvanceSystem,
        sankeFoodSystem,
        foodSpawnSystem,
        snakeDeathSystem
    );

    io.on("connection", socket => {
        udpates.push(new Action.ADD_SNAKE(newSnake(socket.id)));
        console.log("New snake: ", socket.id);

        socket.emit("sync-state", state);
        socket.on("input", (input: Direction) => {
            const snake = state.snakes.find(snake => snake.id === socket.id);
            if (snake !== undefined && Direction[input] !== undefined) {
                snake.input = input;
            }
        });
    });

    setInterval(() => {
        udpates.forEach(action => dispatch(state, action));
        systems.forEach(system => {
            const dispatcher = new Array<Action>();
            system(state, dispatcher);
            dispatcher.forEach(action => dispatch(state, action));
            udpates.push(...dispatcher);
        });

        io.sockets.emit("tick", [...udpates]);
        udpates.splice(0, udpates.length);
    }, 1000 / 10);

    function newSnake(snakeId: string) {
        const length = 3;
        const x = Math.floor(state.cols * 0.5) - Math.floor(length * 0.5);
        const y = Math.floor(state.rows * 0.5);

        const snake = new Snake(snakeId);
        snake.dir = Direction.right;
        for (let i = 0; i < length; i++) {
            snake.cells.push(new Cell(CellType.Snake, x - i, y));
        }

        return snake;
    }
}
