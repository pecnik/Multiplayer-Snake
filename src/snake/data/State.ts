import { Cell } from "./Cell";
import { Snake } from "./Snake";

export class State {
    public readonly rows = 48;
    public readonly cols = 48;
    public snakes = new Array<Snake>();
    public food = new Array<Cell>();

    public highScore = 0;
    public highScorePlayer = "";
}
