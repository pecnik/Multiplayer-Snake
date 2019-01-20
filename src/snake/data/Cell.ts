import { CellType } from "./CellType";

export class Cell {
    public readonly type: CellType;
    public x: number;
    public y: number;
    public constructor(type: CellType, x: number, y: number) {
        this.type = type;
        this.x = x;
        this.y = y;
    }
}
