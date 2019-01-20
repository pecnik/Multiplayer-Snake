import { readFileSync, writeFile } from "fs";

export interface HighScoreData {
    highScore: number;
    highScorePlayer: string;
}

export function loadHighScoreData(path: string): HighScoreData {
    try {
        const json = readFileSync(path, "utf8");
        const data = JSON.parse(json) as HighScoreData;
        return data;
    } catch (e) {
        return {
            highScore: 0,
            highScorePlayer: ""
        };
    }
}

export function saveHighScoreData(path: string, data: HighScoreData) {
    writeFile(path, JSON.stringify(data), err => {
        if (err) {
            console.error(err);
        } else {
            console.log("Saved new high score");
        }
    });
}
