import { Cell } from "./Cell";
import { Snake } from "./Snake";
import { Player } from "./Player";

export class State {
    public readonly rows = 48;
    public readonly cols = 48;
    public players = new Array<Player>();
    public snakes = new Array<Snake>();
    public food = new Array<Cell>();
}
