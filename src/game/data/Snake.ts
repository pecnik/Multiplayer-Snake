import { Cell } from "./Cell";
import { Direction } from "./Direction";

export class Snake {
    public readonly id: string;
    public dir = Direction.right;
    public input = Direction.right;
    public cells = new Array<Cell>();
    public constructor(id: string) {
        this.id = id;
    }
}
