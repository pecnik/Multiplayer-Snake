import { Cell } from "./Types";
import { Snake } from "./Snake";

export class State {
    public readonly rows = 32;
    public readonly cols = 32;
    public snakes = new Array<Snake>();
    public food = new Array<Cell>();
}
