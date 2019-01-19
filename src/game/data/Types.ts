export enum Direction {
    up,
    down,
    left,
    right
}

export enum CellType {
    Food,
    Snake
}

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


