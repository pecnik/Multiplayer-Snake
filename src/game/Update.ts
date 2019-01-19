import { Action } from "./Actions";
import { State } from "./data/State";
import { Snake } from "./data/Snake";
import { Direction, CellType, Cell } from "./data/Types";
import { dispatch } from "./Dispatch";
import {
    System,
    snakeInputSystem,
    snakeAdvanceSystem,
    sankeFoodSystem,
    foodSpawnSystem,
    snakeSpawnSystem,
    snakeDeathSystem
} from "./Systems";

export const systems = new Array<System>(
    snakeSpawnSystem,
    snakeInputSystem,
    snakeAdvanceSystem,
    sankeFoodSystem,
    foodSpawnSystem,
    snakeDeathSystem
);

export function update(state: State) {
    const cahnges = new Array<Action>();
    systems.forEach(system => {
        const dispatcher = new Array<Action>();
        system(state, dispatcher);
        dispatcher.forEach(action => dispatch(state, action));
        cahnges.push(...dispatcher);
    });

    return cahnges;
}
