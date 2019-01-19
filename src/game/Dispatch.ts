import { State } from "./data/State";
import { Action } from "./Actions";
import { memoize } from "lodash";

export const undefinedTypeWarning = memoize((action: Action) => {
    const type = Action.Type[action.type] || action.type;
    console.warn(`Missing Dispatch.${type} case!`);
    return type;
});

export function dispatch(state: State, action: Action) {
    switch (action.type) {
        case Action.Type.ADD_FOOD: {
            const { food } = action;
            dispatch(state, new Action.REMOVE_FOOD(food));
            state.food.push(food);
            break;
        }

        case Action.Type.REMOVE_FOOD: {
            const { food } = action;
            state.food = state.food.filter(cell => {
                return cell.x !== food.x || cell.y !== food.y;
            });
            break;
        }

        case Action.Type.ADD_SNAKE: {
            const { snake } = action;
            dispatch(state, new Action.REMOVE_SNAKE(snake.id));
            state.snakes.push(snake);
            break;
        }

        case Action.Type.REMOVE_SNAKE: {
            const { snakeId } = action;
            state.snakes = state.snakes.filter(snake => {
                return snake.id !== snakeId;
            });
            break;
        }

        case Action.Type.SET_SNAKE_INPUT: {
            const { snakeId, dir } = action;
            const snake = state.snakes.find(snake => snake.id === snakeId);
            if (snake !== undefined) {
                snake.input = dir;
            }
            break;
        }

        case Action.Type.SET_SNAKE_DIR: {
            const { snakeId, dir } = action;
            const snake = state.snakes.find(snake => snake.id === snakeId);
            if (snake !== undefined) {
                snake.dir = dir;
            }
            break;
        }

        case Action.Type.ADVANCE_SNAKE_HEAD: {
            const { snakeId, head } = action;
            const snake = state.snakes.find(snake => snake.id === snakeId);
            if (snake !== undefined) {
                snake.cells.unshift(head);
            }
            break;
        }

        case Action.Type.REMOVE_SNAKE_TAIL: {
            const { snakeId } = action;
            const snake = state.snakes.find(snake => snake.id === snakeId);
            if (snake !== undefined) {
                snake.cells.pop();
            }
            break;
        }

        default: {
            undefinedTypeWarning(action);
            return;
        }
    }
}
