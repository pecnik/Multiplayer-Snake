import { Cell } from "./Cell";
import { Snake } from "./Snake";

export class State {
    public readonly rows = 32;
    public readonly cols = 32;
    public snakes = new Array<Snake>();
    public food = new Array<Cell>();
}
