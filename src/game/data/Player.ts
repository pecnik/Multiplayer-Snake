export class Player {
    public readonly id: string;
    public readonly name: string;
    public score = 0;

    public constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
}
