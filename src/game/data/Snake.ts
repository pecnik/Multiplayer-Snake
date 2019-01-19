import { Direction, Cell } from "./Types";

export class Snake {
    public readonly id: string;
    public dir = Direction.right;
    public input = Direction.right;
    public cells = new Array<Cell>();
    public constructor(id: string) {
        this.id = id;
    }
}
