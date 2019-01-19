import { Snake } from "./data/Snake";
import { Direction, Cell } from "./data/Types";

export type Action =
    | Action.ADD_FOOD
    | Action.REMOVE_FOOD
    | Action.ADD_SNAKE
    | Action.REMOVE_SNAKE
    | Action.SET_SNAKE_INPUT
    | Action.SET_SNAKE_DIR
    | Action.ADVANCE_SNAKE_HEAD
    | Action.REMOVE_SNAKE_TAIL;

export module Action {
    export enum Type {
        ADD_FOOD,
        REMOVE_FOOD,
        ADD_SNAKE,
        REMOVE_SNAKE,
        SET_SNAKE_INPUT,
        SET_SNAKE_DIR,
        ADVANCE_SNAKE_HEAD,
        REMOVE_SNAKE_TAIL
    }

    export interface IAction {
        readonly type: Action.Type;
    }

    export class ADD_FOOD implements IAction {
        public readonly type = Action.Type.ADD_FOOD;
        public readonly food: Cell;
        public constructor(food: Cell) {
            this.food = food;
        }
    }

    export class REMOVE_FOOD implements IAction {
        public readonly type = Action.Type.REMOVE_FOOD;
        public readonly food: Cell;
        public constructor(food: Cell) {
            this.food = food;
        }
    }

    export class ADD_SNAKE implements IAction {
        public readonly type = Action.Type.ADD_SNAKE;
        public readonly snake: Snake;
        public constructor(snake: Snake) {
            this.snake = snake;
        }
    }

    export class REMOVE_SNAKE implements IAction {
        public readonly type = Action.Type.REMOVE_SNAKE;
        public readonly snakeId: string;
        public constructor(snakeId: string) {
            this.snakeId = snakeId;
        }
    }

    export class SET_SNAKE_INPUT implements IAction {
        public readonly type = Action.Type.SET_SNAKE_INPUT;
        public readonly snakeId: string;
        public readonly dir: Direction;
        public constructor(snakeId: string, dir: Direction) {
            this.snakeId = snakeId;
            this.dir = dir;
        }
    }

    export class SET_SNAKE_DIR implements IAction {
        public readonly type = Action.Type.SET_SNAKE_DIR;
        public readonly snakeId: string;
        public readonly dir: Direction;
        public constructor(snakeId: string, dir: Direction) {
            this.snakeId = snakeId;
            this.dir = dir;
        }
    }

    export class ADVANCE_SNAKE_HEAD implements IAction {
        public readonly type = Action.Type.ADVANCE_SNAKE_HEAD;
        public readonly snakeId: string;
        public readonly head: Cell;
        public constructor(snakeId: string, head: Cell) {
            this.snakeId = snakeId;
            this.head = head;
        }
    }

    export class REMOVE_SNAKE_TAIL implements IAction {
        public readonly type = Action.Type.REMOVE_SNAKE_TAIL;
        public readonly snakeId: string;
        public constructor(snakeId: string) {
            this.snakeId = snakeId;
        }
    }
}
