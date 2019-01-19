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
        {
            // Add player to game
            const player = new Player(socket.id, `Player-${uniqueId()}`);
            udpates.push(new Action.ADD_PLAYER(player));
            console.log("New player: ", player.name);
        }

        socket.emit("sync-state", state);

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
        if (state.freezeScreen.timer > 0) {
            if (state.freezeScreen.timer > 1) {
                udpates.push(
                    new Action.FREEZE_SCREEN(
                        state.freezeScreen.timer - 1,
                        state.freezeScreen.actions
                    )
                );
            } else {
                udpates.push(...state.freezeScreen.actions);
                udpates.push(new Action.FREEZE_SCREEN(0, []));
            }
        }

        udpates.forEach(action => dispatch(state, action));

        if (state.freezeScreen.timer === 0) {
            systems.forEach(system => {
                const dispatcher = new Array<Action>();
                system(state, dispatcher);
                dispatcher.forEach(action => dispatch(state, action));
                udpates.push(...dispatcher);
            });
        }

        io.sockets.emit("tick", [...udpates]);
        udpates.splice(0, udpates.length);
    }, 1000 / 10);
}
