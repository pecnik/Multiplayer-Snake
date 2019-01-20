import SocketIO from "socket.io";
import { Action } from "../snake/Actions";
import { State } from "../snake/data/State";
import { Direction } from "../snake/data/Direction";
import { Snake } from "../snake/data/Snake";
import { dispatch } from "../snake/Dispatch";
import { getPlayerNameErrors } from "../snake/Selectors";
import {
    System,
    snakeSpawnSystem,
    snakeInputSystem,
    snakeAdvanceSystem,
    snakeCollisionSystem,
    foodSpawnSystem,
    highScoreSystem
} from "../snake/Systems";

export function runGameServer(io: SocketIO.Server) {
    const state = new State();
    const udpates = new Array<Action>();
    const systems = new Array<System>(
        snakeSpawnSystem,
        snakeInputSystem,
        snakeAdvanceSystem,
        snakeCollisionSystem,
        foodSpawnSystem,
        highScoreSystem
    );

    // Handle players
    io.on("connection", socket => {
        socket.on("login", (name: string = "") => {
            const errorMsg = validatePlayer(name);
            if (errorMsg !== undefined) {
                socket.emit("login-error", errorMsg);
            } else {
                socket.emit("login-success");
                addPlayerToGame(socket, name);
            }
        });
    });

    // Game lopp
    const TICK_RATE = 1000 / 10;
    const UPDATE_SCORES = new Action.UPDATE_SCORES();
    setInterval(() => {
        udpates.forEach(action => dispatch(state, action));
        systems.forEach(system => {
            const dispatcher = new Array<Action>();
            system(state, dispatcher);
            dispatcher.forEach(action => dispatch(state, action));
            udpates.push(...dispatcher);
        });

        // Is called every frame
        udpates.push(UPDATE_SCORES);
        dispatch(state, UPDATE_SCORES);

        // Dump
        io.sockets.emit("tick", [...udpates]);
        udpates.splice(0, udpates.length);
    }, TICK_RATE);

    function validatePlayer(name: string): string | undefined {
        const errorMsg = getPlayerNameErrors(name);
        if (errorMsg !== undefined) {
            return errorMsg;
        }

        const duplicate = state.snakes.find(snake => snake.name === name);
        if (duplicate !== undefined) {
            return `"${name}" is already in use`;
        }

        return;
    }

    function addPlayerToGame(socket: SocketIO.Socket, name: string) {
        socket.on("join-game", () => {
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
    }
}
