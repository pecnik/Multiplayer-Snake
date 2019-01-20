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
    snakeDeathSystem,
    gameSessionSystem
} from "./Systems";
import { Direction } from "./data/Direction";
import { Player } from "./data/Player";
import { uniqueId } from "lodash";

export function GameServer(io: SocketIO.Server) {
    const state = new State();
    const udpates = new Array<Action>();
    const systems = new Array<System>(
        gameSessionSystem,
        snakeInputSystem,
        snakeAdvanceSystem,
        sankeFoodSystem,
        foodSpawnSystem,
        snakeDeathSystem
    );

    io.on("connection", socket => {
        socket.on("join", (name: string = `Player-${uniqueId()}`) => {
            const player = new Player(socket.id, name);
            udpates.push(new Action.ADD_PLAYER(player));
            socket.emit("sync-state", state);
            console.log("New player: ", player.name);
        });

        socket.on("input", (input: Direction) => {
            const snake = state.snakes.find(snake => snake.id === socket.id);
            if (snake !== undefined && Direction[input] !== undefined) {
                snake.input = input;
            }
        });

        socket.on("disconnect", () => {
            udpates.push(new Action.REMOVE_PLAYER(socket.id));
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
