import { State } from "./data/State";
import { Snake } from "./data/Snake";
import { SnakeFSM } from "./data/SnakeFSM";

export const forEachDeadSnake = forEachSnakeFSM(SnakeFSM.Dead);
export const forEachAliveSnake = forEachSnakeFSM(SnakeFSM.Alive);
export const forEachSpawningSnake = forEachSnakeFSM(SnakeFSM.Spawning);
export const forEachDespawningSnake = forEachSnakeFSM(SnakeFSM.Despawning);
export function forEachSnakeFSM(fsm: SnakeFSM) {
    return (state: State, f: (snake: Snake) => void) => {
        state.snakes.forEach(snake => {
            if (snake.fsm === fsm) {
                f(snake);
            }
        });
    };
}
