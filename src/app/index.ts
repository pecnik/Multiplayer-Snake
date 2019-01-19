import { GameClient } from "../game/GameClient";

{
    "use strict";

    const $el = document.getElementById("app");
    if ($el === null) {
        throw new Error("Missing #app element");
    }

    GameClient($el);
}