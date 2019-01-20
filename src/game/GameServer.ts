import SocketIO from "socket.io";
import { Action } from "./Actions";
import { State } from "./data/State";
import { Direction } from "./data/Direction";
import { Snake } from "./data/Snake";
import { uniqueId } from "lodash";
import { dispatch } from "./Dispatch";
import {
    System,
    snakeSpawnSystem,
    snakeInputSystem,
    snakeAdvanceSystem,
    snakeCollisionSystem,
    foodSpawnSystem
} from "./Systems";

export function GameServer(io: SocketIO.Server) {
    const state = new State();
    const udpates = new Array<Action>();
    const systems = new Array<System>(
        snakeSpawnSystem,
        snakeInputSystem,
        snakeAdvanceSystem,
        snakeCollisionSystem,
        foodSpawnSystem
    );

    io.on("connection", socket => {
        socket.on("join", (name: string = `Player-${uniqueId()}`) => {
            const snake = new Snake(socket.id, name);
            udpates.push(new Action.SYNC_SNAKE(snake));
            socket.emit("sync-state", state);
            console.log("New player: ", snake.name);
        });

        socket.on("input", (input: Direction) => {
            const snake = state.snakes.find(snake => snake.id === socket.id);
            if (snake !== undefined && Direction[input] !== undefined) {
                snake.input = input;
            }
        });

        socket.on("disconnect", () => {
            udpates.push(new Action.REMOVE_SNAKE(socket.id));
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
}
