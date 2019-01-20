import { Snake } from "./data/Snake";
import { Cell } from "./data/Cell";
import { Direction } from "./data/Direction";

export type Action =
    | Action.SYNC_SNAKE
    | Action.REMOVE_SNAKE
    | Action.SYNC_FOOD
    | Action.REMOVE_FOOD
    | Action.SET_SNAKE_INPUT
    | Action.SET_SNAKE_DIR
    | Action.ADVANCE_SNAKE_HEAD
    | Action.REMOVE_SNAKE_TAIL
    | Action.UPDATE_SCORES
    | Action.NEW_HIGH_SCORE;

export module Action {
    export enum Type {
        SYNC_SNAKE,
        REMOVE_SNAKE,

        SPAWN_SNAKE,

        SET_SNAKE_INPUT,
        SET_SNAKE_DIR,

        ADVANCE_SNAKE_HEAD,
        REMOVE_SNAKE_TAIL,

        SYNC_FOOD,
        REMOVE_FOOD,

        UPDATE_SCORES,
        NEW_HIGH_SCORE
    }

    export interface IAction {
        readonly type: Action.Type;
    }

    export class SYNC_SNAKE implements IAction {
        public readonly type = Action.Type.SYNC_SNAKE;
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

    export class SYNC_FOOD implements IAction {
        public readonly type = Action.Type.SYNC_FOOD;
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

    export class UPDATE_SCORES implements IAction {
        public readonly type = Action.Type.UPDATE_SCORES;
    }

    export class NEW_HIGH_SCORE implements IAction {
        public readonly type = Action.Type.NEW_HIGH_SCORE;
        public readonly score: number;
        public readonly playerName: string;
        public constructor(score: number, playerName: string) {
            this.score = score;
            this.playerName = playerName;
        }
    }
}
