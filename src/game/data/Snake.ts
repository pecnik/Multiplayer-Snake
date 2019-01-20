import { Cell } from "./Cell";
import { Direction } from "./Direction";
import { SnakeFSM } from "./SnakeFSM";

export class Snake {
    public readonly id: string;
    public readonly name: string;
    public score = 0;
    public fsm = SnakeFSM.Dead;
    public dir = Direction.right;
    public input = Direction.right;
    public cells = new Array<Cell>();
    public timer = 0;

    public constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
}
